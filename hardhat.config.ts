import * as dotenv from "dotenv";
import { task, HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your zown go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const { ETHERSCAN_API_KEY, KOVAN_ALCHEMY_URL, KOVAN_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  networks: {
    kovan: { url: KOVAN_ALCHEMY_URL, accounts: [KOVAN_PRIVATE_KEY] },
    hardhat: {
      // Current as of May 2, 2001, 2:37pm.
      forking: { url: KOVAN_ALCHEMY_URL, blockNumber: 24612367 },
    },
  },
  etherscan: { apiKey: ETHERSCAN_API_KEY },
};
export default config;
