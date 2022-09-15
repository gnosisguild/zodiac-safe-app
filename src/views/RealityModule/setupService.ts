import { ethers } from "ethers"
import { getArbitrator, TxWitMeta as TxsWitMeta } from "../../services"
import { getNetworkNativeAsset } from "../../utils/networks"
import * as ipfs from "../../utils/ipfs"
import * as R from "ramda"
import { setTextRecordTx } from "utils/ens"
import { SdkInstance, SafeInfo } from "@gnosis.pm/safe-apps-sdk"
import { SetupData } from "./RealityModule"
import * as snapshot from "../../utils/snapshot"
import { deployRealityModule, RealityModuleParams } from "./moduleDeployment"

const MULTI_SEND_CONTRACT = process.env.REACT_APP_MULTI_SEND_CONTRACT
const DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS = "0x0961F418E0B6efaA073004989EF1B2fd1bc4a41c" // needs to be deployed on all networks supported by the Reality Module

/**
 * Sets up the Reality Module.
 *
 * @notice The input variables are not checked for validity here, as this happens in the UI.
 */
export const setup = async (
  provider: ethers.providers.JsonRpcProvider,
  safeSdk: SdkInstance,
  safeInfo: SafeInfo,
  executorAddress: string,
  setupData: SetupData,
) => {
  const deploymentRealityModuleTxsMm = await deployRealityModuleTxs(
    safeInfo.chainId,
    safeInfo.safeAddress,
    executorAddress,
    setupData,
  )
  const realityModuleAddress = deploymentRealityModuleTxsMm.meta?.expectedModuleAddress
  console.log("realityModuleAddress calculated:", realityModuleAddress)
  if (realityModuleAddress == null) {
    throw new Error("Unable to calculate the Reality Module future address.")
  }
  const addSafeToSnapshotTxsMm = await addSafeSnapToSnapshotSpaceTxs(
    provider,
    setupData.proposal.ensName,
    realityModuleAddress,
    safeInfo.chainId,
  )

  const txs = [...deploymentRealityModuleTxsMm.txs, ...addSafeToSnapshotTxsMm.txs]

  await safeSdk.txs.send({ txs })

  // await pokeSnapshotAPI(setupData.proposal.ensName); // TODO: if the transactions does not happen immediately, we need to poke the snapshot API in some other way later when the transactions is executed to make sure the new space settings is picked up.
}

/**
 * Generate the transactions required to deploy a Reality Module
 *
 * Can throw if inputs are invalided.
 *
 * @param chainId
 * @param safeAddress
 * @param params Reality Module parameters
 * @returns transaction array
 */
const deployRealityModuleTxs = async (
  chainId: number,
  safeAddress: string,
  executorAddress: string,
  setupData: SetupData,
): Promise<TxsWitMeta> => {
  const bondToken = getNetworkNativeAsset(chainId)
  const moduleDeploymentParameters: RealityModuleParams = {
    executor: executorAddress,
    bond: ethers.utils.parseUnits(setupData.oracle.bondData.bond.toString(), bondToken.decimals).toString(),
    timeout: setupData.oracle.delayData.timeout.toString(),
    cooldown: setupData.oracle.delayData.cooldown.toString(),
    expiration: setupData.oracle.delayData.expiration.toString(),
    arbitrator: getArbitrator(chainId, setupData.oracle.arbitratorData.arbitratorOption),
    oracle: setupData.oracle.instanceData.instanceAddress,
  }
  console.log("moduleDeploymentParameters:", moduleDeploymentParameters)
  console.log("safeAddress", safeAddress)
  console.log("chainId", chainId)
  return await deployRealityModule(
    safeAddress,
    DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS,
    chainId,
    moduleDeploymentParameters,
    setupData.oracle.templateData,
    false,
  )
}

export const addSafeSnapToSettings = (originalSpaceSettings: any, chainId: number, realityModuleAddress: string) =>
  R.assocPath(
    ["plugins", "safeSnap"],
    {
      safes: [
        {
          network: chainId,
          realityAddress: realityModuleAddress,
          multisend: MULTI_SEND_CONTRACT,
        },
      ],
    },
    originalSpaceSettings,
  )

const addSafeSnapToSnapshotSpaceTxs = async (
  provider: ethers.providers.JsonRpcProvider,
  ensName: string,
  realityModuleAddress: string,
  chainId: number,
): Promise<TxsWitMeta> => {
  // 1. Get the current Space setting file.
  const ensResolver = await provider.getResolver(ensName)
  if (!ensResolver) {
    throw new Error(`ENS ${ensName} not found`)
  }
  const currentEnsSnapshotRecord = await ensResolver.getText("snapshot") // for instance, "ipfs://QmWUemB5QDr6Zkp2tqQRcEW1ZC7n4MiLaE6CFneVJUeYyD"
  console.log("currentEnsSnapshotRecord", currentEnsSnapshotRecord)
  if (!currentEnsSnapshotRecord) {
    throw new Error(`ENS ${ensName} has no snapshot record, a Snapshot Space is required`)
  }

  const originalSpaceSettings = await (currentEnsSnapshotRecord.includes("snapshot.page")
    ? snapshot.getSnapshotSpaceSettings(ensName)
    : ipfs.getJsonData(currentEnsSnapshotRecord))

  // 2. Update the Space setting file, by adding the SafeSnap plugin.
  const newSpaceSettings = addSafeSnapToSettings(originalSpaceSettings, chainId, realityModuleAddress)
  // validate the new schema
  if (!checkNewSnapshotSettingsValidity(originalSpaceSettings, newSpaceSettings)) {
    throw new Error("The new settings file is changed in unexpected ways")
  }

  console.log("original space", originalSpaceSettings)
  console.log("new space", newSpaceSettings)

  // 3. Deploy the modified settings file to IPFS.
  const cid = await ipfs.add(JSON.stringify(newSpaceSettings))
  // 4. Pin the new file. No need, as long as we keep it available in our local
  // IPFS node (running in the browser) until Snapshot picks it up, they will pin it..

  // 5. Sett the hash of the new setting file in the ENS snapshot record.
  const setEnsRecordTx = await setTextRecordTx(provider, ensName, "snapshot", `ipfs/${cid.toString()}`)

  return { txs: [setEnsRecordTx] }
}

export const checkNewSnapshotSettingsValidity = (originalSettings: any, newSettings: any) =>
  R.and(
    // check that there are no unintended changes to the new Snapshot Space settings
    R.equals(R.omit(["plugins", "safeSnap"], originalSettings), R.omit(["plugins", "safeSnap"], newSettings)),
    // validate the schema
    // we must be strict here, if not a truthy error value can be returned
    snapshot.validateSchema(newSettings) === true,
  )

// const pokeSnapshotAPI = async (ensName: string) =>
//   fetch(`https://hub.snapshot.org/api/spaces/${ensName}/poke`);
