//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {PredictionMarketToken} from "./PredictionMarketToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PredictionMarket is Ownable {
    /////////////////
    /// Errors //////
    /////////////////

    error PredictionMarket__MustProvideETHForInitialLiquidity();
    error PredictionMarket__InvalidOption();
    error PredictionMarket__InvalidProbability();
    error PredictionMarket__PredictionAlreadyResolved();
    error PredictionMarket__OnlyOracleCanReport();
    error PredictionMarket__PredictionNotResolved();
    error PredictionMarket__InsufficientWinningTokens();
    error PredictionMarket__AmountMustBeGreaterThanZero();
    error PredictionMarket__MustSendExactETHAmount();
    error PredictionMarket__InsufficientTokenReserve();
    error PredictionMarket__TokenTransferFailed();
    error PredictionMarket__NoTokensToRedeem();
    error PredictionMarket__ETHTransferFailed();
    error PredictionMarket__InsufficientBalance(uint256 _tradingAmount, uint256 _userBalance);
    error PredictionMarket__InsufficientAllowance(uint256 _tradingAmount, uint256 _allowance);
    error PredictionMarket__InsufficientLiquidity();
    error PredictionMarket__LiquidityProviderCantBuyTokens();
    error PredictionMarket__LiquidityProviderCantSellTokens();
    error PredictionMarket__InvalidPercentageToLock();
    error PredictionMarket__InsufficientTokenBalance();

    //////////////////////////
    /// State Variables //////
    //////////////////////////

    enum Option {
        YES,
        NO
    }

    uint256 private constant PRECISION = 1e18;

    address public immutable i_oracle;
    uint256 public immutable i_initialTokenValue;
    PredictionMarketToken public immutable i_YesToken;
    PredictionMarketToken public immutable i_NoToken;
    uint256 public immutable i_percentageLocked;
    uint256 public immutable i_initialProbability;

    string public i_question;
    PredictionMarketToken public s_winningToken;
    bool public s_isReported;
    uint256 public s_ethCollateral; // used to be ethReserve; eth pot which get's later distributed to winners
    uint256 public s_lpTradingRevenue; // used to be lpReserve; fees which get's later distributed to liquidity providers, TODO: find better word

    /////////////////////////
    /// Events //////
    /////////////////////////

    event TokensPurchased(address indexed buyer, Option option, uint256 amount, uint256 ethAmount);
    event TokensSold(address indexed seller, Option option, uint256 amount, uint256 ethAmount);
    event WinningTokensRedeemed(address indexed redeemer, uint256 amount, uint256 ethAmount);
    event MarketReported(address indexed oracle, Option winningOption, address winningToken);
    event MarketResolved(address indexed resolver, uint256 totalEthToSend);
    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokensAmount);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokensAmount);

    /////////////////
    /// Modifiers ///
    /////////////////

    modifier onlyPredictionOpen() {
        if (s_isReported) {
            revert PredictionMarket__PredictionAlreadyResolved();
        }
        _;
    }

    modifier withValidOption(Option _option) {
        if (_option != Option.YES && _option != Option.NO) {
            revert PredictionMarket__InvalidOption();
        }
        _;
    }

    /////////////////
    /// Functions ///
    /////////////////

    constructor(
        address _oracle,
        string memory _question,
        uint256 _initialTokenValue,
        uint8 _initialYesProbability,
        uint8 _percentageToLock
    ) payable Ownable(msg.sender) {
        if (msg.value <= 0) {
            revert PredictionMarket__MustProvideETHForInitialLiquidity();
        }
        if (_initialYesProbability > 100) {
            revert PredictionMarket__InvalidProbability();
        }

        if (_percentageToLock > 100) {
            revert PredictionMarket__InvalidPercentageToLock();
        }

        i_oracle = _oracle;
        i_question = _question;
        i_initialTokenValue = _initialTokenValue;
        i_initialProbability = _initialYesProbability;
        i_percentageLocked = _percentageToLock;
        s_ethCollateral = msg.value;

        uint256 initialTokenAmount = (msg.value * PRECISION) / _initialTokenValue;
        i_YesToken = new PredictionMarketToken("Yes", "Y", initialTokenAmount, msg.sender);
        i_NoToken = new PredictionMarketToken("No", "N", initialTokenAmount, msg.sender);

        if (_percentageToLock > 0) {
            uint256 initialYesAmountLocked =
                (initialTokenAmount * _initialYesProbability * _percentageToLock * 2) / 10000;
            uint256 initialNoAmountLocked =
                (initialTokenAmount * (100 - _initialYesProbability) * _percentageToLock * 2) / 10000;

            bool success1 = i_YesToken.transfer(msg.sender, initialYesAmountLocked);
            bool success2 = i_NoToken.transfer(msg.sender, initialNoAmountLocked);
            if (!success1 || !success2) {
                revert PredictionMarket__TokenTransferFailed();
            }
        }
    }

    /**
     * @notice Buy prediction outcome tokens with ETH, need to call priceInETH function first to get right amount of tokens to buy
     * @param _option The option (YES or NO) to buy tokens for
     * @param _amountTokenToBuy Amount of tokens to purchase
     */
    function buyTokensWithETH(Option _option, uint256 _amountTokenToBuy)
        external
        payable
        onlyPredictionOpen
        withValidOption(_option)
    {
        if (_amountTokenToBuy == 0) {
            revert PredictionMarket__AmountMustBeGreaterThanZero();
        }

        if (msg.sender == owner()) {
            revert PredictionMarket__LiquidityProviderCantBuyTokens();
        }

        uint256 ethNeeded = getBuyPriceInEth(_option, _amountTokenToBuy);
        if (msg.value != ethNeeded) {
            revert PredictionMarket__MustSendExactETHAmount();
        }

        PredictionMarketToken optionToken = _option == Option.YES ? i_YesToken : i_NoToken;

        if (_amountTokenToBuy > optionToken.balanceOf(address(this))) {
            revert PredictionMarket__InsufficientTokenReserve();
        }

        s_lpTradingRevenue += msg.value;

        bool success = optionToken.transfer(msg.sender, _amountTokenToBuy);
        if (!success) {
            revert PredictionMarket__TokenTransferFailed();
        }

        emit TokensPurchased(msg.sender, _option, _amountTokenToBuy, msg.value);
    }

    /**
     * @notice Sell prediction outcome tokens for ETH, need to call priceInETH function first to get right amount of tokens to buy
     * @param _option The option (YES or NO) to sell tokens for
     * @param _tradingAmount The amount of tokens to sell
     */
    function sellTokensForEth(Option _option, uint256 _tradingAmount)
        external
        onlyPredictionOpen
        withValidOption(_option)
    {
        if (_tradingAmount == 0) {
            revert PredictionMarket__AmountMustBeGreaterThanZero();
        }

        if (msg.sender == owner()) {
            revert PredictionMarket__LiquidityProviderCantSellTokens();
        }

        PredictionMarketToken optionToken = _option == Option.YES ? i_YesToken : i_NoToken;
        uint256 userBalance = optionToken.balanceOf(msg.sender);
        if (userBalance < _tradingAmount) {
            revert PredictionMarket__InsufficientBalance(_tradingAmount, userBalance);
        }
        uint256 ethToReceive = getSellPriceInEth(_option, _tradingAmount);

        uint256 allowance = optionToken.allowance(msg.sender, address(this));
        if (allowance < _tradingAmount) {
            revert PredictionMarket__InsufficientAllowance(_tradingAmount, allowance);
        }

        s_lpTradingRevenue -= ethToReceive;

        (bool sent,) = msg.sender.call{value: ethToReceive}("");
        if (!sent) {
            revert PredictionMarket__ETHTransferFailed();
        }

        bool success = optionToken.transferFrom(msg.sender, address(this), _tradingAmount);
        if (!success) {
            revert PredictionMarket__TokenTransferFailed();
        }

        emit TokensSold(msg.sender, _option, _tradingAmount, ethToReceive);
    }

    /**
     * @notice Report the winning option for the prediction
     * @param _winningOption The winning option (YES or NO)
     */
    function report(Option _winningOption) external onlyPredictionOpen withValidOption(_winningOption) {
        if (msg.sender != i_oracle) {
            revert PredictionMarket__OnlyOracleCanReport();
        }
        // Set winning option
        s_winningToken = _winningOption == Option.YES ? i_YesToken : i_NoToken;
        s_isReported = true;
        emit MarketReported(msg.sender, _winningOption, address(s_winningToken));
    }

    /**
     * @notice Redeem winning tokens for ETH after prediction is resolved, winning tokens are burned and user receives ETH
     * @param _amount The amount of winning tokens to redeem
     */
    function redeemWinningTokens(uint256 _amount) external {
        if (_amount == 0) {
            revert PredictionMarket__AmountMustBeGreaterThanZero();
        }

        if (!s_isReported) {
            revert PredictionMarket__PredictionNotResolved();
        }

        if (s_winningToken.balanceOf(msg.sender) < _amount) {
            revert PredictionMarket__InsufficientWinningTokens();
        }

        uint256 ethToReceive = (_amount * i_initialTokenValue) / PRECISION;

        s_ethCollateral -= ethToReceive;

        s_winningToken.burn(msg.sender, _amount);

        (bool success,) = msg.sender.call{value: ethToReceive}("");
        if (!success) {
            revert PredictionMarket__ETHTransferFailed();
        }

        emit WinningTokensRedeemed(msg.sender, _amount, ethToReceive);
    }

    /**
     * @notice Owner of contract can redeem winning tokens held by the contract after prediction is resolved and get ETH from the contract including LP revenue and collateral back
     * @dev Only callable by the owner
     * @return ethRedeemed The amount of ETH redeemed
     */
    function resolveMarketAndWithdraw() external onlyOwner returns (uint256 ethRedeemed) {
        if (!s_isReported) {
            revert PredictionMarket__PredictionNotResolved();
        }

        uint256 contractWinningTokens = s_winningToken.balanceOf(address(this));
        if (contractWinningTokens > 0) {
            ethRedeemed = (contractWinningTokens * i_initialTokenValue) / PRECISION;

            if (ethRedeemed > s_ethCollateral) {
                ethRedeemed = s_ethCollateral;
            }

            s_ethCollateral -= ethRedeemed;
        }

        uint256 totalEthToSend = ethRedeemed + s_lpTradingRevenue;

        s_lpTradingRevenue = 0;

        s_winningToken.burn(address(this), contractWinningTokens);

        (bool success,) = msg.sender.call{value: totalEthToSend}("");
        if (!success) {
            revert PredictionMarket__ETHTransferFailed();
        }

        emit MarketResolved(msg.sender, totalEthToSend);

        return ethRedeemed;
    }

    /**
     * @notice Calculate the total ETH price for buying tokens
     * @param _option The option (YES or NO) to buy tokens for
     * @param _tradingAmount The amount of tokens to buy
     * @return The total ETH price
     */
    function getBuyPriceInEth(Option _option, uint256 _tradingAmount) public view returns (uint256) {
        return _calculatePriceInEth(_option, _tradingAmount, false);
    }

    /**
     * @notice Calculate the total ETH price for selling tokens
     * @param _option The option (YES or NO) to sell tokens for
     * @param _tradingAmount The amount of tokens to sell
     * @return The total ETH price
     */
    function getSellPriceInEth(Option _option, uint256 _tradingAmount) public view returns (uint256) {
        return _calculatePriceInEth(_option, _tradingAmount, true);
    }

    function addLiquidity() external payable onlyOwner {
        if (s_isReported) {
            revert PredictionMarket__PredictionAlreadyResolved();
        }
        s_ethCollateral += msg.value;

        i_YesToken.mint(address(this), (msg.value * PRECISION) / i_initialTokenValue);
        i_NoToken.mint(address(this), (msg.value * PRECISION) / i_initialTokenValue);

        emit LiquidityAdded(msg.sender, msg.value, (msg.value * PRECISION) / i_initialTokenValue);
    }

    /**
     * @notice Remove liquidity from the prediction market and burn corresponding tokens, if you remove liquidity before prediction ends you got no share of lpReserve
     * @param _ethToWithdraw Amount of ETH to withdraw from liquidity pool
     */
    function removeLiquidity(uint256 _ethToWithdraw) external onlyOwner {
        uint256 amountTokenToBurn = (_ethToWithdraw / i_initialTokenValue) * PRECISION;

        if (amountTokenToBurn > (i_YesToken.balanceOf(address(this)))) {
            revert PredictionMarket__InsufficientTokenReserve();
        }

        if (amountTokenToBurn > (i_NoToken.balanceOf(address(this)))) {
            revert PredictionMarket__InsufficientTokenReserve();
        }

        s_ethCollateral -= _ethToWithdraw;

        i_YesToken.burn(address(this), amountTokenToBurn);
        i_NoToken.burn(address(this), amountTokenToBurn);

        (bool success,) = msg.sender.call{value: _ethToWithdraw}("");
        if (!success) {
            revert PredictionMarket__ETHTransferFailed();
        }

        emit LiquidityRemoved(msg.sender, _ethToWithdraw, amountTokenToBurn);
    }

    /////////////////////////
    /// Helper Functions ///
    ////////////////////////

    /**
     * @dev Internal helper to calculate ETH price for both buying and selling
     * @param _option The option (YES or NO)
     * @param _tradingAmount The amount of tokens
     * @param _isSelling Whether this is a sell calculation
     */
    function _calculatePriceInEth(Option _option, uint256 _tradingAmount, bool _isSelling)
        private
        view
        returns (uint256)
    {
        (uint256 currentTokenReserve, uint256 currentOtherTokenReserve) = _getCurrentReserves(_option);

        /// Ensure sufficient liquidity when buying
        if (!_isSelling) {
            if (currentTokenReserve < _tradingAmount) {
                revert PredictionMarket__InsufficientLiquidity();
            }
        }

        uint256 totalTokenSupply = i_YesToken.totalSupply();

        /// Before trade
        uint256 currentTokenSoldBefore = totalTokenSupply - currentTokenReserve;
        uint256 currentOtherTokenSold = totalTokenSupply - currentOtherTokenReserve;

        uint256 totalTokensSoldBefore = currentTokenSoldBefore + currentOtherTokenSold;
        uint256 probabilityBefore = _calculateProbability(currentTokenSoldBefore, totalTokensSoldBefore);

        /// After trade
        uint256 currentTokenReserveAfter =
            _isSelling ? currentTokenReserve + _tradingAmount : currentTokenReserve - _tradingAmount;
        uint256 currentTokenSoldAfter = totalTokenSupply - currentTokenReserveAfter;

        uint256 totalTokensSoldAfter =
            _isSelling ? totalTokensSoldBefore - _tradingAmount : totalTokensSoldBefore + _tradingAmount;

        uint256 probabilityAfter = _calculateProbability(currentTokenSoldAfter, totalTokensSoldAfter);

        /// Compute final price
        uint256 probabilityAvg = (probabilityBefore + probabilityAfter) / 2;
        return (i_initialTokenValue * probabilityAvg * _tradingAmount) / (PRECISION * PRECISION);
    }

    function _getCurrentReserves(Option _option) private view returns (uint256, uint256) {
        if (_option == Option.YES) {
            return (i_YesToken.balanceOf(address(this)), i_NoToken.balanceOf(address(this)));
        } else {
            return (i_NoToken.balanceOf(address(this)), i_YesToken.balanceOf(address(this)));
        }
    }

    function _calculateProbability(uint256 tokensSold, uint256 totalSold) private pure returns (uint256) {
        if (totalSold == 0) {
            return 50;
        }
        return (tokensSold * PRECISION) / totalSold;
    }

    /////////////////////////
    /// Getter Functions ///
    ////////////////////////

    function prediction()
        external
        view
        returns (
            string memory question,
            string memory outcome1,
            string memory outcome2,
            address oracle,
            uint256 initialTokenValue,
            uint256 yesTokenReserve,
            uint256 noTokenReserve,
            bool isReported,
            address yesToken,
            address noToken,
            address winningToken,
            uint256 ethCollateral,
            uint256 lpTradingRevenue,
            address predictionMarketOwner,
            uint256 initialProbability,
            uint256 percentageLocked
        )
    {
        question = i_question;
        outcome1 = i_YesToken.name();
        outcome2 = i_NoToken.name();
        oracle = i_oracle;
        initialTokenValue = i_initialTokenValue;
        yesTokenReserve = i_YesToken.balanceOf(address(this));
        noTokenReserve = i_NoToken.balanceOf(address(this));
        isReported = s_isReported;
        yesToken = address(i_YesToken);
        noToken = address(i_NoToken);
        winningToken = address(s_winningToken);
        ethCollateral = s_ethCollateral;
        lpTradingRevenue = s_lpTradingRevenue;
        predictionMarketOwner = owner();
        initialProbability = i_initialProbability;
        percentageLocked = i_percentageLocked;
    }
}
