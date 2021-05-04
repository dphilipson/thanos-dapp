import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { constructorArgs } from "./util/constants";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

export async function deploy({
  ethers,
}: HardhatRuntimeEnvironment): Promise<Contract> {
  const Thanos = await ethers.getContractFactory("Thanos");
  const thanos = await Thanos.deploy(...constructorArgs);
  return thanos;
}

export function verify(
  address: string,
  { run }: HardhatRuntimeEnvironment
): Promise<void> {
  return run("verify", {
    address: address,
    constructorArgsParams: constructorArgs,
  });
}

export async function deployAndVerify(
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const thanos = await deploy(hre);
  console.log("Thanos deployed to:", thanos.address);
  console.log("Awaiting five confirmations before verifying on Etherscan.");
  await thanos.deployTransaction.wait(5);
  console.log("Done waiting for confirmations. Verifying.");
  await verify(thanos.address, hre);
  console.log("Verification complete!");
}
