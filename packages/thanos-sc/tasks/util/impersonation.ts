import { BigNumberish, Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Thanos } from "../../typechain/Thanos";
import {
  LINK_ADDRESS,
  LINK_OWNER_ADDRESS,
  MOCK_VRF_ADDRESS,
} from "./constants";
import erc20Abi from "./erc20Abi.json";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

export async function grantLink(
  hre: HardhatRuntimeEnvironment,
  address: string,
  amount: BigNumberish
): Promise<void> {
  await withImpersonation(hre, LINK_OWNER_ADDRESS, async (signer) => {
    const link = new hre.ethers.Contract(LINK_ADDRESS, erc20Abi, signer);
    await link.transfer(address, amount);
  });
}

export async function produceRandomness(
  hre: HardhatRuntimeEnvironment,
  thanos: Thanos,
  requestId: string,
  randomness: BigNumberish = getRandomness()
): Promise<void> {
  await withImpersonation(hre, MOCK_VRF_ADDRESS, async (signer) => {
    const vrfThanos = thanos.connect(signer);
    await vrfThanos.rawFulfillRandomness(requestId, randomness);
  });
}

export async function withImpersonation<T>(
  { network, ethers }: HardhatRuntimeEnvironment,
  address: string,
  f: (signer: Signer) => Promise<T>
): Promise<T> {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [address],
  });
  try {
    return await f(ethers.provider.getSigner(address));
  } finally {
    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [address],
    });
  }
}

export function getRandomness(): number {
  return (Math.random() * (1 << 48)) | 0;
}
