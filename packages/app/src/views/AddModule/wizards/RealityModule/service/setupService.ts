import { ethers } from "ethers"
import { getArbitrator, TxWitMeta as TxsWitMeta } from "../../../../../services"
import { NETWORK, NETWORKS } from "../../../../../utils/networks"
import * as ipfs from "../../../../../services/ipfs"
import * as R from "ramda"
import { setTextRecordTx } from "services/ens"
import { SdkInstance, SafeInfo } from "@gnosis.pm/safe-apps-sdk"
import { SetupData } from ".."
import * as snapshot from "../../../../../services/snapshot"
import { deployRealityModule, RealityModuleParams } from "./moduleDeployment"
import { setUpMonitoring } from "./minitoring"
import { pinSnapshotSpace } from "./snapshot-space-pinning"

const MULTI_SEND_CONTRACT = process.env.REACT_APP_MULTI_SEND_CONTRACT
const DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS =
  "0x0961F418E0B6efaA073004989EF1B2fd1bc4a41c" // needs to be deployed on all networks supported by the Reality Module

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

  await Promise.all([
    safeSdk.txs.send({ txs }),
    setUpMonitoring(
      NETWORKS[safeInfo.chainId as NETWORK].name,
      realityModuleAddress,
      setupData.monitoring,
    ),
  ])

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
  const bondToken = NETWORKS[chainId as NETWORK].nativeAsset
  const moduleDeploymentParameters: RealityModuleParams = {
    executor: executorAddress,
    bond: ethers.utils
      .parseUnits(setupData.oracle.bondData.bond.toString(), bondToken.decimals)
      .toString(),
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

export const addSafeSnapToSettings = (
  originalSpaceSettings: any,
  chainId: number,
  realityModuleAddress: string,
) =>
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
  // 1. Get the current Space setting file. from IPFS directly or from
  const originalSpaceSettings = await snapshot.getSnapshotSpaceSettings(ensName, chainId)

  // 2. Update the Space setting file, by adding the SafeSnap plugin.
  const newSpaceSettings = addSafeSnapToSettings(
    originalSpaceSettings,
    chainId,
    realityModuleAddress,
  )
  // validate the new schema
  if (!snapshot.verifyNewSnapshotSettings(originalSpaceSettings, newSpaceSettings)) {
    throw new Error("The new settings file is changed in unexpected ways")
  }

  console.log("original space", originalSpaceSettings)
  console.log("new space", newSpaceSettings)

  // 3. Deploy the modified settings file to IPFS.
  const cidV1Locale = (await ipfs.add(JSON.stringify(newSpaceSettings))).toV1().toString()
  // 4. Pin the new file

  const { cidV1: cidV1FromPinning } = await pinSnapshotSpace({
    snapshotSpaceEnsName: ensName,
    snapshotSpaceSettings: newSpaceSettings,
  })

  if (cidV1Locale !== cidV1FromPinning) {
    throw new Error(
      `The CID from the locale browser node (${cidV1Locale}) does not correspond with the CID from the pinning service (${cidV1FromPinning})`,
    )
  }

  // 5. Sett the hash of the new setting file in the ENS snapshot record.
  const setEnsRecordTx = await setTextRecordTx(
    provider,
    ensName,
    "snapshot",
    `ipfs://${cidV1Locale}`,
  )

  return { txs: [setEnsRecordTx] }
}
