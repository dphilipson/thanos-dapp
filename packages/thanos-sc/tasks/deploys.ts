import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getConstructorArgs } from "./util/constants";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

export async function deploy({
  ethers,
  network,
}: HardhatRuntimeEnvironment): Promise<Contract> {
  const args = getConstructorArgs(network.name);
  const Thanos = await ethers.getContractFactory("Thanos");
  const thanos = await Thanos.deploy(...args);
  return thanos;
}

export function verify(
  address: string,
  { run, network }: HardhatRuntimeEnvironment
): Promise<void> {
  const args = getConstructorArgs(network.name);
  return run("verify", {
    address: address,
    constructorArgsParams: args,
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
