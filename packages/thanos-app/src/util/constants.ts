import { EthNetwork } from "./metamask";

export const IS_PROD = process.env.NODE_ENV === "production";

const HARDHAT_THANOS_ADDRESS = "0x2388d1b9d8e958528643ef6046c638879e210294";
const KOVAN_THANOS_ADDRESS = "0x3B04075Fe798D78c871Ce87eD30D366670eb36a5";

export function getThanosAddress(network: EthNetwork): string {
  switch (network) {
    case EthNetwork.HARDHAT:
      return HARDHAT_THANOS_ADDRESS;
    case EthNetwork.KOVAN:
      return KOVAN_THANOS_ADDRESS;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

/** EIP-1193 userRejectedRequest error. */
export const USER_REJECTED = 4001;
