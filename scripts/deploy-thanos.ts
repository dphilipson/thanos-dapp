// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

const VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";
const LINK_ADDRESS = "0xa36085f69e2889c224210f603d836748e7dc0088";
const KEY_HASH =
  "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
const FEE = "100000000000000000";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Thanos = await ethers.getContractFactory("Thanos");
  const thanos = await Thanos.deploy(VRF_ADDRESS, LINK_ADDRESS, KEY_HASH, FEE);
  await thanos.deployed();
  console.log("Thanos deployed to:", thanos.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
