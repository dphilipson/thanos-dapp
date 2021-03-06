import { BigNumber } from "@ethersproject/bignumber";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getConstructorArgs, networkConstants } from "./util/constants";
import {
  getRandomness,
  grantLink,
  fulfillRandomness,
} from "./util/impersonation";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

// This may not be built yet when tasks need to load.
type Thanos = import("../typechain/Thanos").Thanos;

export async function develop(hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log("Deploying Thanos.");
  const Thanos = await hre.ethers.getContractFactory("Thanos");
  const thanos = (await Thanos.deploy(
    ...getConstructorArgs("hardhat")
  )) as Thanos;
  console.log("Thanos deployed to:", thanos.address);
  console.log("Granting LINK to Thanos.");
  await grantLink(
    hre,
    thanos.address,
    BigNumber.from(networkConstants.kovan.fee).mul(100)
  );
  thanos.on(thanos.filters.SnapStarted(null, null), (_, __, { args }) => {
    const { requestId } = args;
    const randomness = getRandomness();
    fulfillRandomness(hre, thanos, requestId, randomness);
    console.log("Produced randomness:", randomness);
  });
  console.log("LINK granted.");
  console.log("Mock VRF is ready.");

  // Wait forever.
  await new Promise(noop);
}

function noop(): void {
  // Nothing.
}
