import { EthNetwork } from "./metamask";

export const IS_PROD = process.env.NODE_ENV === "production";

const HARDHAT_THANOS_ADDRESS = "0x2388d1b9d8e958528643ef6046c638879e210294";
const REAL_THANOS_ADDRESS = "0xa26431e49c883d6fE9e608Df90811098A1E0BCFc";

export function getThanosAddress(network: EthNetwork): string {
  switch (network) {
    case EthNetwork.HARDHAT:
      return HARDHAT_THANOS_ADDRESS;
    case EthNetwork.KOVAN:
    case EthNetwork.RINKEBY:
      return REAL_THANOS_ADDRESS;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

/** EIP-1193 userRejectedRequest error. */
export const USER_REJECTED = 4001;
