import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

const VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";
const LINK_ADDRESS = "0xa36085f69e2889c224210f603d836748e7dc0088";
const KEY_HASH =
  "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
const FEE = "100000000000000000";

const constructorArgs = [VRF_ADDRESS, LINK_ADDRESS, KEY_HASH, FEE] as const;

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
