import { deployAndSetUpModule, KnownContracts } from "@gnosis.pm/zodiac"
import { ethers } from "ethers"
import { enableModule, TxWitMeta } from "services"
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk"

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
      tokenAddress, // token
      name, // name
      votingDelay.toString(), // votingDelay
      votingPeriod.toString(), // votingPeriod
      proposalThreshold.toString(), // proposalThreshold
      quorumPercent.toString(), // quorum
    ],
    types: ["address", "address", "string", "uint256", "uint256", "uint256", "uint256"],
  }

  const saltNonce = Date.now().toString()
  const chainId = (await provider.getNetwork()).chainId

  const { transaction: deploymentTx, expectedModuleAddress: expectedAddress } =
    deployAndSetUpModule(
      "KnownContracts.OZ_GOVERNOR" as any as KnownContracts, // TODO: get the known contract here once its available in the KnownContracts enum from zodiac
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
  tokenAddress: string,
  name: string,
  votingDelay: number,
  votingPeriod: number,
  proposalThreshold: number,
  quorumPercent: number,
) => {
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
  if (meta?.expectedAddress == null) {
    throw new Error("The expected value is missing")
  }
  const enableModuleTx = enableModule(safeAddress, meta.expectedAddress)

  return safeSdk.txs
    .send({ txs: [...deployOzGovernorTxs, enableModuleTx] })
    .catch((e) => {
      console.error(e)
      throw new Error("Error when proposing transactions to the Safe")
    })
}
