import { deployAndSetUpModule, KnownContracts } from "@gnosis.pm/zodiac"
import { ethers } from "ethers"
import { enableModule, TxWitMeta } from "services"
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk"

const MULTI_SEND_CONTRACT = process.env.REACT_APP_MULTI_SEND_CONTRACT
if (MULTI_SEND_CONTRACT == null) {
  throw new Error("The MULTI_SEND_CONTRACT environment variable is not set.")
}

export type CreateTokenArgs = {
  name: string
  symbol: string
  kind: "ERC20" | "ERC721"
}

const deployOzGovernorModule = async (
  provider: ethers.providers.JsonRpcProvider,
  safeAddress: string,
  tokenAddress: string,
  name: string,
  votingDelay: number,
  votingPeriod: number,
  proposalThreshold: number,
  quorumPercent: number,
): Promise<TxWitMeta> => {
  // input validation
  if (safeAddress == null) {
    throw new Error("No safe address provided")
  }
  if (tokenAddress == null) {
    throw new Error("No token address provided")
  }
  if (name == null) {
    throw new Error("No name provided")
  }
  if (votingDelay == null) {
    throw new Error("No voting delay provided")
  }
  if (votingPeriod == null) {
    throw new Error("No voting period provided")
  }
  if (proposalThreshold == null) {
    throw new Error("No proposal threshold provided")
  }
  if (quorumPercent == null) {
    throw new Error("No quorum percent provided")
  }
  if (quorumPercent > 100 || quorumPercent < 0) {
    throw new Error("Quorum percent must be between 0 and 100")
  }

  const initData = {
    values: [
      safeAddress, // owner
      safeAddress, // target
      MULTI_SEND_CONTRACT, // multisend
      tokenAddress, // token
      name, // name
      votingDelay.toString(), // votingDelay
      votingPeriod.toString(), // votingPeriod
      proposalThreshold.toString(), // proposalThreshold
      quorumPercent.toString(), // quorum
      "0", // initialVoteExtension
    ],
    types: [
      "address",
      "address",
      "address",
      "address",
      "string",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint64",
    ],
  }

  const saltNonce = Date.now().toString()
  const chainId = (await provider.getNetwork()).chainId

  const { transaction: deploymentTx, expectedModuleAddress: expectedAddress } =
    deployAndSetUpModule(
      KnownContracts.OZ_GOVERNOR,
      initData,
      provider,
      chainId,
      saltNonce,
    )

  return {
    txs: [
      {
        ...deploymentTx,
        value: deploymentTx.value.toString(),
      },
    ], // transactions to be executed by the safe
    meta: { expectedAddress }, // any additional data needed from the setup process
  }
}

export const deployVotesTokenTx = async (
  provider: ethers.providers.JsonRpcProvider,
  safeAddress: string,
  tokenName: string,
  tokenSymbol: string,
  kind: "ERC20" | "ERC721",
): Promise<TxWitMeta> => {
  if (safeAddress == null) {
    throw new Error("No safe address provided")
  }
  if (tokenName == null) {
    throw new Error("No token name provided")
  }
  if (tokenSymbol == null) {
    throw new Error("No token symbol provided")
  }
  if (kind !== "ERC20" && kind !== "ERC721") {
    throw new Error("Invalid token kind")
  }

  const initData = {
    values: [
      safeAddress, // owner
      tokenName, // name
      tokenSymbol, // symbol
    ],
    types: ["address", "string", "string"],
  }

  const saltNonce = Date.now().toString()
  const chainId = (await provider.getNetwork()).chainId

  const { transaction: deploymentTx, expectedModuleAddress: expectedAddress } =
    deployAndSetUpModule(
      kind === "ERC20" ? KnownContracts.ERC20_VOTES : KnownContracts.ERC721_VOTES,
      initData,
      provider,
      chainId,
      saltNonce,
    )

  return {
    txs: [
      {
        ...deploymentTx,
        value: deploymentTx.value.toString(),
      },
    ], // transactions to be executed by the safe
    meta: { expectedAddress }, // any additional data needed from the setup process
  }
}

export const deployAndEnableOzGovernorModule = async (
  provider: ethers.providers.JsonRpcProvider,
  safeSdk: SafeAppsSDK,
  safeAddress: string,
  name: string,
  votingDelay: number,
  votingPeriod: number,
  proposalThreshold: number,
  quorumPercent: number,
  tokenAddress?: string,
  createTokenArgs?: CreateTokenArgs,
) => {
  if (tokenAddress == null && createTokenArgs == null) {
    throw new Error("No token address or create token args provided")
  } else if (tokenAddress != null && createTokenArgs != null) {
    throw new Error("Both token address and create token args provided")
  }
  const txs = []
  if (createTokenArgs != null) {
    const { txs: deployTokenTxs, meta } = await deployVotesTokenTx(
      provider,
      safeAddress,
      createTokenArgs.name,
      createTokenArgs.symbol,
      createTokenArgs.kind,
    )
    txs.push(...deployTokenTxs)

    if (meta?.expectedAddress == null) {
      throw new Error("No expected address returned from token deployment")
    }
    tokenAddress = meta.expectedAddress
  }

  if (tokenAddress == null) {
    throw new Error(
      "No token address provided. Should not be possible. Either the token address should be provided or a new token should be deployed.",
    )
  }

  const { txs: deployOzGovernorTxs, meta } = await deployOzGovernorModule(
    provider,
    safeAddress,
    tokenAddress,
    name,
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorumPercent,
  )
  txs.push(...deployOzGovernorTxs)
  if (meta?.expectedAddress == null) {
    throw new Error("The expected value is missing")
  }
  const enableModuleTx = enableModule(safeAddress, meta.expectedAddress)
  txs.push(enableModuleTx)

  return safeSdk.txs.send({ txs: txs }).catch((e) => {
    console.error(e)
    throw new Error("Error when proposing transactions to the Safe")
  })
}
