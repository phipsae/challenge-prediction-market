/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    PredictionMarket: {
      address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_oracle",
              type: "address",
            },
            {
              internalType: "string",
              name: "_question",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_initialTokenValue",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "_initialYesProbability",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "_percentageToLock",
              type: "uint8",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__AmountMustBeGreaterThanZero",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__ETHTransferFailed",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_tradingAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_allowance",
              type: "uint256",
            },
          ],
          name: "PredictionMarket__InsufficientAllowance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_tradingAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_userBalance",
              type: "uint256",
            },
          ],
          name: "PredictionMarket__InsufficientBalance",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InsufficientLiquidity",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InsufficientTokenBalance",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InsufficientTokenReserve",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InsufficientWinningTokens",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InvalidOption",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InvalidPercentageToLock",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__InvalidProbability",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__LiquidityProviderCantBuyTokens",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__LiquidityProviderCantSellTokens",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__MustProvideETHForInitialLiquidity",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__MustSendExactETHAmount",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__NoTokensToRedeem",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__OnlyOracleCanReport",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__PredictionAlreadyResolved",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__PredictionNotResolved",
          type: "error",
        },
        {
          inputs: [],
          name: "PredictionMarket__TokenTransferFailed",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "provider",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokensAmount",
              type: "uint256",
            },
          ],
          name: "LiquidityAdded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "provider",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "tokensAmount",
              type: "uint256",
            },
          ],
          name: "LiquidityRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "oracle",
              type: "address",
            },
            {
              indexed: false,
              internalType: "enum PredictionMarket.Option",
              name: "winningOption",
              type: "uint8",
            },
            {
              indexed: false,
              internalType: "address",
              name: "winningToken",
              type: "address",
            },
          ],
          name: "MarketReported",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "resolver",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalEthToSend",
              type: "uint256",
            },
          ],
          name: "MarketResolved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "buyer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "enum PredictionMarket.Option",
              name: "option",
              type: "uint8",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
          ],
          name: "TokensPurchased",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "seller",
              type: "address",
            },
            {
              indexed: false,
              internalType: "enum PredictionMarket.Option",
              name: "option",
              type: "uint8",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
          ],
          name: "TokensSold",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "redeemer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "ethAmount",
              type: "uint256",
            },
          ],
          name: "WinningTokensRedeemed",
          type: "event",
        },
        {
          inputs: [],
          name: "addLiquidity",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "enum PredictionMarket.Option",
              name: "_option",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "_amountTokenToBuy",
              type: "uint256",
            },
          ],
          name: "buyTokensWithETH",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "enum PredictionMarket.Option",
              name: "_option",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "_tradingAmount",
              type: "uint256",
            },
          ],
          name: "getBuyPriceInEth",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "enum PredictionMarket.Option",
              name: "_option",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "_tradingAmount",
              type: "uint256",
            },
          ],
          name: "getSellPriceInEth",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "prediction",
          outputs: [
            {
              internalType: "string",
              name: "question",
              type: "string",
            },
            {
              internalType: "string",
              name: "outcome1",
              type: "string",
            },
            {
              internalType: "string",
              name: "outcome2",
              type: "string",
            },
            {
              internalType: "address",
              name: "oracle",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "initialTokenValue",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "yesTokenReserve",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "noTokenReserve",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isReported",
              type: "bool",
            },
            {
              internalType: "address",
              name: "yesToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "noToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "winningToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "ethCollateral",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "lpTradingRevenue",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "predictionMarketOwner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "initialProbability",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "percentageLocked",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "redeemWinningTokens",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_ethToWithdraw",
              type: "uint256",
            },
          ],
          name: "removeLiquidity",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "enum PredictionMarket.Option",
              name: "_winningOption",
              type: "uint8",
            },
          ],
          name: "report",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "resolveMarketAndWithdraw",
          outputs: [
            {
              internalType: "uint256",
              name: "ethRedeemed",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "s_ethCollateral",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_initialProbability",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_initialTokenValue",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_isReported",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lpTradingRevenue",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_noToken",
          outputs: [
            {
              internalType: "contract PredictionMarketToken",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_oracle",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_percentageLocked",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_question",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_winningToken",
          outputs: [
            {
              internalType: "contract PredictionMarketToken",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_yesToken",
          outputs: [
            {
              internalType: "contract PredictionMarketToken",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "enum PredictionMarket.Option",
              name: "_option",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "_tradingAmount",
              type: "uint256",
            },
          ],
          name: "sellTokensForEth",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        owner: "@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "@openzeppelin/contracts/access/Ownable.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
