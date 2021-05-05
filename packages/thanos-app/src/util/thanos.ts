import { Contract, Signer } from "ethers";
import thanosSpec from "../sc-generated/artifacts/contracts/Thanos.sol/Thanos.json";
import { Thanos } from "../sc-generated/typechain/Thanos";
import { THANOS_ADDRESS } from "./constants";

export enum SnapState {
  NOT_STARTED,
  IN_PROGRESS,
  DUSTED,
  ALIVE,
}

export class ThanosClient {
  private readonly thanos: Thanos;

  constructor(signer: Signer) {
    this.thanos = new Contract(
      THANOS_ADDRESS,
      thanosSpec.abi,
      signer
    ) as Thanos;
  }

  public getSnapState(): Promise<SnapState> {
    return this.thanos.getSnapState() as Promise<SnapState>;
  }

  public async snap(): Promise<void> {
    await this.thanos.snap((Math.random() * (1 << 48)) | 0);
  }

  /**
   * Returns true if the user was dusted.
   */
  public async waitForSnapResult(): Promise<boolean> {
    const snapper = await this.thanos.signer.getAddress();
    return new Promise((resolve) => {
      this.thanos.on(
        this.thanos.filters.SnapResolved(null, snapper, null),
        (_, __, ___, { args }) => resolve(args.isDusted)
      );
      // Check if the snap was already done when we started waiting.
      this.getSnapState().then((state) => {
        if (state === SnapState.DUSTED) {
          return true;
        } else if (state === SnapState.ALIVE) {
          return false;
        }
      });
    });
  }
}
