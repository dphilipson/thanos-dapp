import { BigNumber } from "@ethersproject/bignumber";
import { Event } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import hre, { ethers } from "hardhat";
import { getConstructorArgs, networkConstants } from "../tasks/util/constants";
import { grantLink, fulfillRandomness } from "../tasks/util/impersonation";
import { notNull } from "../tasks/util/typeAssertions";
import { Thanos } from "../typechain/Thanos";

// TypeScript trick to import module's type extensions without importing module.
(_: typeof import("@nomiclabs/hardhat-ethers")) => 0;

use(chaiAsPromised);

const fee = BigNumber.from(networkConstants.hardhat.fee);

describe("Thanos", () => {
  let signer: SignerWithAddress;
  let thanos: Thanos;

  before(async () => {
    const signers = await ethers.getSigners();
    signer = signers[0];
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
    await grantLink(hre, thanos.address, fee.div(10));
    await expect(thanos.snap(getRandomSeed())).to.eventually.be.rejectedWith(
      /LINK/
    );
  });

  it("emits a CoinFlipped event", async () => {
    await grantLink(hre, thanos.address, fee);
    const transaction = await thanos.snap(getRandomSeed());
    const { events } = await transaction.wait();
    const requestId = getRequestIdFromEvents(notNull(events));
    expect(requestId).to.exist;
  });

  it("dusts on even numbers", async () => {
    await grantLink(hre, thanos.address, fee);
    const transaction = await thanos.snap(getRandomSeed());
    const { events } = await transaction.wait();
    const requestId = getRequestIdFromEvents(notNull(events));
    await fulfillRandomness(hre, thanos, requestId, 42);
    const result = await thanos.getSnapState();
    expect(result).to.equal(2);
  });

  it("spares on odd numbers", async () => {
    await grantLink(hre, thanos.address, fee);
    const transaction = await thanos.snap(getRandomSeed());
    const { events } = await transaction.wait();
    const requestId = getRequestIdFromEvents(notNull(events));
    await fulfillRandomness(hre, thanos, requestId, 43);
    const result = await thanos.getSnapState();
    expect(result).to.equal(3);
  });

  async function deployThanos(): Promise<Thanos> {
    const args = getConstructorArgs("hardhat");
    const Thanos = await ethers.getContractFactory("Thanos");
    const thanos = (await Thanos.deploy(...args)) as Thanos;
    await thanos.deployed();
    return thanos;
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
