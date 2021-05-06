/**
 * This address is just some rando who happened to have LINK and ETH. We'll
 * drain his account when we need LINK in our test accounts.
 *
 * This address is on Kovan, because our dev environment forks Kovan.
 */
export const LINK_OWNER_ADDRESS = "0x50055d3480f05e63b5e0c72af0256a7313aa1ad0";

export interface NetworkConstants {
  vrfAddress: string;
  linkAddress: string;
  keyHash: string;
  fee: string;
}

const kovanConstants: NetworkConstants = {
  vrfAddress: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
  linkAddress: "0xa36085f69e2889c224210f603d836748e7dc0088",
  keyHash: "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
  fee: "100000000000000000",
};

const rinkebyConstants: NetworkConstants = {
  vrfAddress: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
  linkAddress: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
  keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
  fee: "100000000000000000",
};

/**
 * The mock VRF contract can be any address that we can impersonate and has ETH
 * to pay its transaction fees. We can't use the real VRF contract address
 * because it has no ETH and can't be sent any.
 */
export const MOCK_VRF_ADDRESS = LINK_OWNER_ADDRESS;

export const networkConstants: Record<string, NetworkConstants> = {
  kovan: kovanConstants,
  rinkeby: rinkebyConstants,
  hardhat: { ...kovanConstants, vrfAddress: LINK_OWNER_ADDRESS },
};

export function getConstructorArgs(
  network: string
): [string, string, string, string] {
  const { vrfAddress, linkAddress, keyHash, fee } = networkConstants[network];
  return [vrfAddress, linkAddress, keyHash, fee];
}
