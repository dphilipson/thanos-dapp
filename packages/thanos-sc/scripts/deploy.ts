#!/usr/bin/env yarn ts-node --transpile-only
import { spawn } from "child_process";
import { config as dotenvConfig } from "dotenv";
import { Wallet, ContractFactory, providers, Signer, Contract } from "ethers";
import thanosSpec from "../artifacts/contracts/Thanos.sol/Thanos.json";
import { getConstructorArgs } from "../tasks/util/constants";

dotenvConfig();

const {
  KOVAN_ALCHEMY_URL,
  RINKEBY_ALCHEMY_URL,
  DEPLOY_PRIVATE_KEY,
} = process.env;

const ZERO_ADDRESS = `0x${"0".repeat(40)}`;

async function main(): Promise<void> {
  const alchemyUrls = {
    kovan: KOVAN_ALCHEMY_URL,
    rinkeby: RINKEBY_ALCHEMY_URL,
  };
  const signers = mapValues(alchemyUrls, getSigner);
  console.log("Checking nonces.");
  const nonces = await mapAndAwaitValues(signers, (signer) =>
    signer.getTransactionCount()
  );
  const minNonce = Math.min(...Object.values(nonces));
  const maxNonce = Math.max(...Object.values(nonces));
  if (minNonce === maxNonce) {
    console.log("All nonces match.");
  } else {
    console.log(`Min nonce: ${minNonce}`);
    console.log(`Max nonce: ${maxNonce}`);
    console.log("Syncing nonces.");
    await Promise.all(
      Object.keys(signers).map((network) =>
        syncNonce(signers[network], nonces[network], maxNonce)
      )
    );
  }
  console.log("Deploying contracts.");
  const contracts = await mapAndAwaitValues(signers, deploy);
  console.log("Awaiting five confirmations before verifying.");
  await mapAndAwaitValues(contracts, waitForConfirmations);
  console.log("Verifying on Etherscan.");
  await mapAndAwaitValues(contracts, verifyOnEtherscan);
}

function getSigner(providerUrl: string, network: string): Signer {
  const provider = new providers.JsonRpcProvider(providerUrl, network);
  return new Wallet(DEPLOY_PRIVATE_KEY, provider);
}

async function syncNonce(
  signer: Signer,
  currentNonce: number,
  targetNonce: number
): Promise<void> {
  const responses: providers.TransactionResponse[] = [];
  for (let i = currentNonce; i < targetNonce; i++) {
    const response = await sendEmptyTransaction(signer);
    responses.push(response);
  }
  await Promise.all(responses.map((response) => response.wait(1)));
}

function sendEmptyTransaction(
  signer: Signer
): Promise<providers.TransactionResponse> {
  return signer.sendTransaction({ to: ZERO_ADDRESS });
}

function deploy(signer: Signer, network: string): Promise<Contract> {
  const Thanos = new ContractFactory(
    thanosSpec.abi,
    thanosSpec.bytecode,
    signer
  );
  const args = getConstructorArgs(network);
  return Thanos.deploy(...args);
}

async function waitForConfirmations(contract: Contract): Promise<void> {
  await contract.deployTransaction.wait(5);
}

function verifyOnEtherscan(contract: Contract, network: string): Promise<void> {
  const args = getConstructorArgs(network);
  return execStreaming("yarn", [
    "hardhat",
    "--network",
    network,
    "verify",
    contract.address,
    ...args,
  ]);
}

function mapValues<K extends keyof any, V, W>(
  obj: Record<K, V>,
  f: (value: V, key: K) => W
): Record<K, W> {
  const result = {};
  Object.keys(obj).forEach((key) => (result[key] = f(obj[key], key as any)));
  return result as Record<K, W>;
}

function mapAndAwaitValues<K extends keyof any, V, W>(
  obj: Record<K, V>,
  f: (value: V, key: K) => Promise<W>
): Promise<Record<K, W>> {
  return promiseAllValues(mapValues(obj, f));
}

async function promiseAllValues<K extends keyof any, V>(
  obj: Record<K, Promise<V>>
): Promise<Record<K, V>> {
  const keys = Object.keys(obj);
  const promises = keys.map((key) => obj[key]);
  const values = await Promise.all(promises);
  const result = {};
  keys.forEach((key, i) => (result[key] = values[i]));
  return result as Record<K, V>;
}

/**
 * Runs the specified command and returns a promise which completes when the
 * command does. Differs from `child_process.exec()` in that the output is piped
 * to the parent process's output as it is produced, rather than buffered and
 * returned at the very end. This makes it useful when the executed command
 * displays streaming status updates, such as a `docker build`.
 */
async function execStreaming(
  command: string,
  args: string[],
  envOverrides?: Record<string, string>
): Promise<void> {
  const child = spawn(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...envOverrides },
  });
  return new Promise((resolve, reject) =>
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const argsText = args.join(" ");
        reject(
          new Error(
            `'${command} ${argsText}' exited with nonzero status ${code}.`
          )
        );
      }
    })
  );
}

main();
