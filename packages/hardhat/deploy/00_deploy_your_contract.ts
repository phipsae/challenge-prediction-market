import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { ethers } from "hardhat";
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const question = "Will the green car win the race?";
  const initialLiquidity = ethers.parseEther("1");
  const initialTokenValue = ethers.parseEther("0.01");
  const initialProbability = 60;
  const percentageLocked = 10;
  const liquidityProvider = "0xca4150f26B2B3e933b9432Ae57DE6354860E180E";
  const oracle = "0xca4150f26B2B3e933b9432Ae57DE6354860E180E";

  await deploy("PredictionMarket", {
    from: deployer,
    // Contract constructor arguments
    args: [liquidityProvider, oracle, question, initialTokenValue, initialProbability, percentageLocked],
    log: true,
    value: initialLiquidity.toString(),
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const predictionMarket = await hre.ethers.getContract<Contract>("PredictionMarket", deployer);
  console.log("PredictionMarket deployed to:", await predictionMarket.getAddress());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["PredictionMarket"];
