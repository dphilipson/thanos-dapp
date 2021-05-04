export const VRF_ADDRESS = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";
export const LINK_ADDRESS = "0xa36085f69e2889c224210f603d836748e7dc0088";
export const KEY_HASH =
  "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
export const FEE = "100000000000000000";

/**
 * This address is just some rando who happened to have LINK and ETH. We'll
 * drain his account when we need LINK in our test accounts.
 */
export const LINK_OWNER_ADDRESS = "0x50055d3480f05e63b5e0c72af0256a7313aa1ad0";

/**
 * The mock VRF contract can be any address that we can impersonate and has ETH
 * to pay its transaction fees. We can't use the real VRF contract address
 * because it has no ETH and can't be sent any.
 */
export const MOCK_VRF_ADDRESS = LINK_OWNER_ADDRESS;

export const constructorArgs = [
  VRF_ADDRESS,
  LINK_ADDRESS,
  KEY_HASH,
  FEE,
] as const;

export const devConstructorArgs = [
  MOCK_VRF_ADDRESS,
  LINK_ADDRESS,
  KEY_HASH,
  FEE,
] as const;
