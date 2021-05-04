import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Contract, Event } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers, network } from "hardhat";
import erc20Abi from "../tasks/util/erc20Abi.json";
import { notNull } from "../tasks/util/typeAssertions";
import { Thanos } from "../typechain/Thanos";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

use(chaiAsPromised);

const LINK_ADDRESS = "0xa36085f69e2889c224210f603d836748e7dc0088";
const KEY_HASH =
  "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
const FEE = BigNumber.from(10).pow(17);

// This address is just some rando who happened to have LINK and ETH. We'll
// drain his account when we need LINK in our test accounts.
const LINK_OWNER_ADDRESS = "0x50055d3480f05e63b5e0c72af0256a7313aa1ad0";

// Similarly, we need to mock the randomness contract by impersonating it and
// sending transactions from it, but we can't do it with the real VRF address
// because it has no ETH to perform the transaction. But any address that has
// ETH is perfectly good for the mock.
const VRF_ADDRESS = LINK_OWNER_ADDRESS;

describe("Thanos", () => {
  let signer: SignerWithAddress;
  let thanos: Thanos;
  let link: Contract;

  before(async () => {
    const signers = await ethers.getSigners();
    signer = signers[0];
    link = new ethers.Contract(LINK_ADDRESS, erc20Abi, signer);
  });

  beforeEach(async () => {
    thanos = await deployThanos();
  });

  it("returns NOT_STARTED as initial snap result", async () => {
    expect(await thanos.getSnapState()).to.equal(0);
  });

  it("prevents snapping if no LINK stored", async () => {
    await expect(thanos.snap(getRandomSeed())).to.eventually.be.rejectedWith(
      /LINK/
    );
  });

  it("prevents snapping if not enough LINK stored", async () => {
    await grantLink(thanos.address, FEE.div(10));
    await expect(thanos.snap(getRandomSeed())).to.eventually.be.rejectedWith(
      /LINK/
    );
  });

  it("emits a CoinFlipped event", async () => {
    await grantLink(thanos.address, FEE);
    const transaction = await thanos.snap(getRandomSeed());
    const { events } = await transaction.wait();
    const requestId = getRequestIdFromEvents(notNull(events));
    expect(requestId).to.exist;
  });

  it("dusts on even numbers", async () => {
    await grantLink(thanos.address, FEE);
    const transaction = await thanos.snap(getRandomSeed());
    const { events } = await transaction.wait();
    const requestId = getRequestIdFromEvents(notNull(events));
    await produceRandomness(requestId, 42);
    const result = await thanos.getSnapState();
    expect(result).to.equal(2);
  });

  it("spares on odd numbers", async () => {
    await grantLink(thanos.address, FEE);
    const transaction = await thanos.snap(getRandomSeed());
    const { events } = await transaction.wait();
    const requestId = getRequestIdFromEvents(notNull(events));
    await produceRandomness(requestId, 43);
    const result = await thanos.getSnapState();
    expect(result).to.equal(3);
  });

  async function deployThanos(): Promise<Thanos> {
    const Thanos = await ethers.getContractFactory("Thanos");
    const thanos = (await Thanos.deploy(
      VRF_ADDRESS,
      LINK_ADDRESS,
      KEY_HASH,
      FEE
    )) as Thanos;
    await thanos.deployed();
    return thanos;
  }

  async function grantLink(
    address: string,
    amount: BigNumberish
  ): Promise<void> {
    await withImpersonation(LINK_OWNER_ADDRESS, async (signer) => {
      const ownerLink = link.connect(signer);
      await ownerLink.transfer(address, amount);
    });
  }

  async function produceRandomness(
    requestId: string,
    randomness: BigNumberish
  ): Promise<void> {
    await withImpersonation(VRF_ADDRESS, async (signer) => {
      const vrfThanos = thanos.connect(signer);
      await vrfThanos.rawFulfillRandomness(requestId, randomness);
    });
  }

  async function withImpersonation<T>(
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

  function getRequestIdFromEvents(events: Event[]): string {
    const event = events.find(
      (e) =>
        e.address === thanos.address &&
        e.event === "SnapStarted" &&
        e.args?.snapper === signer.address
    );
    return event?.args?.requestId;
  }
});

function getRandomSeed(): number {
  return (Math.random() * (1 << 48)) | 0;
}
