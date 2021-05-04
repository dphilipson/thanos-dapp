import * as dotenv from "dotenv";
import { task, HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import { deployAndVerify, verify } from "./tasks/deploys";
import { develop } from "./tasks/develop";
import { notNull } from "./tasks/util/typeAssertions";
import { exec } from "child_process";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your zown go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-thanos", "Deploys this contract.", (_, hre) =>
  deployAndVerify(hre)
);

task("verify-thanos", "Verifies the contract on Etherscan.")
  .addPositionalParam(
    "address",
    "Address of the contract to verify.",
    undefined,
    undefined,
    false
  )
  .setAction((taskArgs, hre) => verify(taskArgs.address, hre));

task(
  "develop",
  "Runs a development chain with mocked randomness.",
  async (_, hre) => {
    hre.run("node");
    await develop(hre);
  }
);

// Extend the compile task to copy artifacts to frontend.
task("compile").setAction(async (_, __, runSuper) => {
  await runSuper();
  exec("scripts/copy-artifacts-to-frontend.sh");
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const { ETHERSCAN_API_KEY, KOVAN_ALCHEMY_URL, KOVAN_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  networks: {
    kovan: { url: KOVAN_ALCHEMY_URL, accounts: [notNull(KOVAN_PRIVATE_KEY)] },
    hardhat: {
      // Current as of May 2, 2001, 2:37pm.
      forking: { url: notNull(KOVAN_ALCHEMY_URL), blockNumber: 24612367 },
    },
  },
  etherscan: { apiKey: ETHERSCAN_API_KEY },
};
export default config;
