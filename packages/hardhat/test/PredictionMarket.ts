import { expect } from "chai";
import { ethers } from "hardhat";
import { PredictionMarket } from "../typechain-types";

describe("PredictionMarket", function () {
  // We define a fixture to reuse the same setup in every test.

  let predictionMarket: PredictionMarket;
  let owner: any;
  let oracle: any;

  before(async () => {
    [owner, oracle] = await ethers.getSigners();
    const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = (await predictionMarketFactory.deploy(
      owner.address,
      oracle.address,
      "Test Question",
      ethers.parseEther("1"),
      50,
      20,
      { value: ethers.parseEther("10") },
    )) as PredictionMarket;
    await predictionMarket.waitForDeployment();
  });

  describe("Checkpoint2", function () {
    it("Should revert when no ETH is provided for initial liquidity", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");

      await expect(
        predictionMarketFactory.deploy(
          owner.address,
          oracle.address,
          "Test Question",
          ethers.parseEther("1"),
          50,
          20,
          { value: 0 }, // No ETH provided
        ),
      ).to.be.revertedWithCustomError(predictionMarketFactory, "PredictionMarket__MustProvideETHForInitialLiquidity");
    });

    it("Should revert when initialYesProbability is 0 or >= 100", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");

      // Test case 1: initialYesProbability = 0
      await expect(
        predictionMarketFactory.deploy(
          owner.address,
          oracle.address,
          "Test Question",
          ethers.parseEther("1"),
          0, // Invalid probability (0)
          20,
          { value: ethers.parseEther("10") },
        ),
      ).to.be.revertedWithCustomError(predictionMarketFactory, "PredictionMarket__InvalidProbability");

      // Test case 2: initialYesProbability = 100
      await expect(
        predictionMarketFactory.deploy(
          owner.address,
          oracle.address,
          "Test Question",
          ethers.parseEther("1"),
          100, // Invalid probability (>= 100)
          20,
          { value: ethers.parseEther("10") },
        ),
      ).to.be.revertedWithCustomError(predictionMarketFactory, "PredictionMarket__InvalidProbability");
    });

    it("Should revert when percentageToLock is >= 100 or 0", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");

      // Test case 1: percentageToLock = 0
      await expect(
        predictionMarketFactory.deploy(
          owner.address,
          oracle.address,
          "Test Question",
          ethers.parseEther("1"),
          50,
          0, // Invalid percentage (0)
          { value: ethers.parseEther("10") },
        ),
      ).to.be.revertedWithCustomError(predictionMarketFactory, "PredictionMarket__InvalidPercentageToLock");

      // Test case 2: percentageToLock = 100
      await expect(
        predictionMarketFactory.deploy(
          owner.address,
          oracle.address,
          "Test Question",
          ethers.parseEther("1"),
          50,
          100, // Invalid percentage (>= 100)
          { value: ethers.parseEther("10") },
        ),
      ).to.be.revertedWithCustomError(predictionMarketFactory, "PredictionMarket__InvalidPercentageToLock");
    });
    it("Should set the correct state variables on deployment", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const question = "Will the green car win the race?";
      const initialTokenValue = ethers.parseEther("0.01");
      const initialYesProbability = 60;
      const percentageToLock = 10;
      const initialLiquidity = ethers.parseEther("1");

      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
      const predictionMarket = await predictionMarketFactory.deploy(
        owner.address,
        oracle.address,
        question,
        initialTokenValue,
        initialYesProbability,
        percentageToLock,
        { value: initialLiquidity },
      );
      await predictionMarket.waitForDeployment();

      // Verify all state variables are set correctly
      expect(await predictionMarket.s_oracle()).to.equal(oracle.address);
      expect(await predictionMarket.s_question()).to.equal(question);
      expect(await predictionMarket.s_initialTokenValue()).to.equal(initialTokenValue);
      expect(await predictionMarket.s_initialYesProbability()).to.equal(initialYesProbability);
      expect(await predictionMarket.s_percentageLocked()).to.equal(percentageToLock);
      expect(await predictionMarket.s_ethCollateral()).to.equal(initialLiquidity);
    });
  });

  describe("Checkpoint3", function () {
    it("Should correctly calculate initial token amounts", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const question = "Will the green car win the race?";
      const initialTokenValue = ethers.parseEther("0.01");
      const initialYesProbability = 60;
      const percentageToLock = 10;
      const initialLiquidity = ethers.parseEther("1");

      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
      const predictionMarket = await predictionMarketFactory.deploy(
        owner.address,
        oracle.address,
        question,
        initialTokenValue,
        initialYesProbability,
        percentageToLock,
        { value: initialLiquidity },
      );
      await predictionMarket.waitForDeployment();

      // Get token contracts
      const yesTokenAddress = await predictionMarket.s_yesToken();
      const noTokenAddress = await predictionMarket.s_noToken();
      const yesToken = await ethers.getContractAt("PredictionMarketToken", yesTokenAddress);
      const noToken = await ethers.getContractAt("PredictionMarketToken", noTokenAddress);

      // Calculate expected values
      const PRECISION = BigInt(1e18); // 1e18 precision
      const initialTokenAmount = (initialLiquidity * PRECISION) / initialTokenValue; // 10 tokens

      // Verify token amounts
      expect(await yesToken.totalSupply()).to.equal(initialTokenAmount);
      expect(await noToken.totalSupply()).to.equal(initialTokenAmount);
    });

    it("Should correctly transfer locked tokens to deployer", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const question = "Will the green car win the race?";
      const initialTokenValue = ethers.parseEther("0.01");
      const initialYesProbability = 60;
      const percentageToLock = 10;
      const initialLiquidity = ethers.parseEther("1");

      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
      const predictionMarket = await predictionMarketFactory.deploy(
        owner.address,
        oracle.address,
        question,
        initialTokenValue,
        initialYesProbability,
        percentageToLock,
        { value: initialLiquidity },
      );
      await predictionMarket.waitForDeployment();

      // Get token contracts
      const yesTokenAddress = await predictionMarket.s_yesToken();
      const noTokenAddress = await predictionMarket.s_noToken();
      const yesToken = await ethers.getContractAt("PredictionMarketToken", yesTokenAddress);
      const noToken = await ethers.getContractAt("PredictionMarketToken", noTokenAddress);

      // Calculate expected values
      const PRECISION = BigInt(1e18); // 1e18 precision
      const initialTokenAmount = (initialLiquidity * PRECISION) / initialTokenValue; // 10 tokens
      const initialYesAmountLocked =
        (initialTokenAmount * BigInt(initialYesProbability) * BigInt(percentageToLock) * BigInt(2)) / BigInt(10000);
      const initialNoAmountLocked =
        (initialTokenAmount * BigInt(100 - initialYesProbability) * BigInt(percentageToLock) * BigInt(2)) /
        BigInt(10000);

      // Verify locked token transfers to deployer
      expect(await yesToken.balanceOf(owner.address)).to.equal(initialYesAmountLocked);
      expect(await noToken.balanceOf(owner.address)).to.equal(initialNoAmountLocked);
    });
  });

  describe("Checkpoint4", function () {
    it("Should successfully add liquidity, mint tokens and update state variables", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
      const predictionMarket = await predictionMarketFactory.deploy(
        owner.address,
        oracle.address,
        "Test Question",
        ethers.parseEther("1"),
        50,
        20,
        { value: ethers.parseEther("10") },
      );
      await predictionMarket.waitForDeployment();
      const initialEthCollateral = await predictionMarket.s_ethCollateral();
      const liquidityToAdd = ethers.parseEther("5");
      const expectedTokenAmount = (liquidityToAdd * BigInt(1e18)) / ethers.parseEther("1");
      // Get initial token balances
      const yesTokenAddress = await predictionMarket.s_yesToken();
      const noTokenAddress = await predictionMarket.s_noToken();
      const yesToken = await ethers.getContractAt("PredictionMarketToken", yesTokenAddress);
      const noToken = await ethers.getContractAt("PredictionMarketToken", noTokenAddress);
      const initialYesTokenBalance = await yesToken.balanceOf(predictionMarket.getAddress());
      const initialNoTokenBalance = await noToken.balanceOf(predictionMarket.getAddress());
      // Add liquidity
      await predictionMarket.connect(owner).addLiquidity({ value: liquidityToAdd });
      // Verify state changes
      expect(await predictionMarket.s_ethCollateral()).to.equal(initialEthCollateral + liquidityToAdd);
      expect(await yesToken.balanceOf(predictionMarket.getAddress())).to.equal(
        initialYesTokenBalance + expectedTokenAmount,
      );
      expect(await noToken.balanceOf(predictionMarket.getAddress())).to.equal(
        initialNoTokenBalance + expectedTokenAmount,
      );
    });

    it("Should revert when trying to remove more tokens than available", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
      const predictionMarket = await predictionMarketFactory.deploy(
        owner.address,
        oracle.address,
        "Test Question",
        ethers.parseEther("1"),
        50,
        20,
        { value: ethers.parseEther("10") },
      );
      await predictionMarket.waitForDeployment();

      // Try to remove more ETH than we initially provided
      const ethToRemove = ethers.parseEther("11"); // Try to remove 11 ETH when we only have 10 ETH worth of tokens

      // Try to remove liquidity with more tokens than available
      await expect(predictionMarket.connect(owner).removeLiquidity(ethToRemove)).to.be.revertedWithCustomError(
        predictionMarket,
        "PredictionMarket__InsufficientTokenReserve",
      );
    });
    it("Should successfully remove liquidity, burn tokens and update state variables", async function () {
      const [owner, oracle] = await ethers.getSigners();
      const predictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
      const predictionMarket = await predictionMarketFactory.deploy(
        owner.address,
        oracle.address,
        "Test Question",
        ethers.parseEther("1"),
        50,
        20,
        { value: ethers.parseEther("10") },
      );
      await predictionMarket.waitForDeployment();
      const initialEthCollateral = await predictionMarket.s_ethCollateral();
      const ethToRemove = ethers.parseEther("5");
      const expectedTokenAmount = (ethToRemove * BigInt(1e18)) / ethers.parseEther("1");
      // Get initial token balances
      const yesTokenAddress = await predictionMarket.s_yesToken();
      const noTokenAddress = await predictionMarket.s_noToken();
      const yesToken = await ethers.getContractAt("PredictionMarketToken", yesTokenAddress);
      const noToken = await ethers.getContractAt("PredictionMarketToken", noTokenAddress);
      const initialYesTokenBalance = await yesToken.balanceOf(predictionMarket.getAddress());
      const initialNoTokenBalance = await noToken.balanceOf(predictionMarket.getAddress());
      // Remove liquidity
      await predictionMarket.connect(owner).removeLiquidity(ethToRemove);
      // Verify state changes
      expect(await predictionMarket.s_ethCollateral()).to.equal(initialEthCollateral - ethToRemove);
      expect(await yesToken.balanceOf(predictionMarket.getAddress())).to.equal(
        initialYesTokenBalance - expectedTokenAmount,
      );
      expect(await noToken.balanceOf(predictionMarket.getAddress())).to.equal(
        initialNoTokenBalance - expectedTokenAmount,
      );
    });
  });

  describe("Checkpoint5", function () {
    it("Should revert when trying to add liquidity after prediction is reported", async function () {
      // First report the prediction
      await predictionMarket.connect(oracle).report(0); // Report YES as winning option

      // Try to add liquidity after prediction is reported
      await expect(
        predictionMarket.connect(owner).addLiquidity({ value: ethers.parseEther("1") }),
      ).to.be.revertedWithCustomError(predictionMarket, "PredictionMarket__PredictionAlreadyResolved");
    });
  });
});
