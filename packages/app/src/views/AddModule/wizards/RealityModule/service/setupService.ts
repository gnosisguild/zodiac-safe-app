import { BrowserProvider, ethers, parseUnits } from 'ethers'
import { getArbitrator, TxWitMeta as TxsWitMeta } from '../../../../../services'
import { NETWORK, NETWORKS } from '../../../../../utils/networks'
// import * as ipfs from '../../../../../services/ipfs'
import * as R from 'ramda'
import { setTextRecordTx } from 'services/ens'
import { SetupData } from '..'
import SafeAppsSDK, { SafeInfo } from '@gnosis.pm/safe-apps-sdk'
import * as snapshot from '../../../../../services/snapshot'
import { deployRealityModule, RealityModuleParams } from './moduleDeployment'
import { pinSnapshotSpace } from './snapshot-space-pinning'
import { setUpMonitoring } from './monitoring'
const MULTI_SEND_CONTRACT = import.meta.env.VITE_MULTI_SEND_CONTRACT
export const DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS = '0x0961F418E0B6efaA073004989EF1B2fd1bc4a41c' // needs to be deployed on all networks supported by the Reality Module

export const addSafeSnapToSnapshotSpaceTxs = async (
  signer: ethers.JsonRpcSigner,
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

  // 3. Deploy the modified settings file to IPFS.
  // We moved this logic to the backend
  // const cidV0Locale = (await ipfs.add(JSON.stringify(newSpaceSettings))).toV0().toString()

  // 4. Pin the new file
  let cidV0FromPinning = ''
  try {
    const { cidV0 } = await pinSnapshotSpace({
      snapshotSpaceEnsName: ensName,
      snapshotSpaceSettings: newSpaceSettings,
      chainId,
    })
    cidV0FromPinning = cidV0
  } catch (e) {
    throw new Error('Failed to pin the new snapshot space settings file. Error from backend: ' + e)
  }

  if (cidV0FromPinning === '' || cidV0FromPinning == null) {
    throw new Error('Communication with the backend pinning service failed. No CID was returned.')
  }

  // 5. Sett the hash of the new setting file in the ENS snapshot record.
  const setEnsRecordTx = await setTextRecordTx(
    signer,
    ensName,
    'snapshot',
    `ipfs://${cidV0FromPinning}`,
  )
  return { txs: [setEnsRecordTx] }
}

/**
 * Sets up the Reality Module.
 *
 * @notice The input variables are not checked for validity here, as this happens in the UI.
 */
export const setup = async (
  provider: BrowserProvider,
  safeSdk: SafeAppsSDK,
  safeInfo: SafeInfo,
  executorAddress: string,
  setupData: SetupData,
  statusCallback: (currentStatus: string, error?: Error) => void,
) => {
  statusCallback('Setting up Reality Module deployment transactions')
  const signer = await provider.getSigner()

  const deploymentRealityModuleTxsMm = await deployRealityModuleTxs(
    provider,
    safeInfo.chainId,
    safeInfo.safeAddress,
    executorAddress,
    setupData,
  ).catch((e) => {
    statusCallback('Error while setting up Reality Module deployment transactions', e)
  })

  if (deploymentRealityModuleTxsMm == null) {
    throw new Error(
      "The creation of transactions failed. IT SHOULD NOT BE POSSIBLE TO REACH THIS STATE. Should be handled in the 'statusCallback' function.",
    )
  }
  const realityModuleAddress = deploymentRealityModuleTxsMm.meta?.daoModuleExpectedAddress

  if (realityModuleAddress == null) {
    const error = new Error('Unable to calculate the Reality Module future address.')
    statusCallback(error.message, error)
  }

  if (realityModuleAddress == null) {
    throw new Error(
      "The calculated reality module address is 'null'. This should be handled in the 'statusCallback' function.",
    )
  }
  statusCallback('Setting up transaction for adding the new snapshot space to the ENS record')
  try {
    const { txs: safeSnapTxs } = await addSafeSnapToSnapshotSpaceTxs(
      signer,
      setupData.proposal.ensName,
      realityModuleAddress,
      safeInfo.chainId,
    )

    if (deploymentRealityModuleTxsMm == null || safeSnapTxs == null) {
      throw new Error(
        'The creation of transactions failed. IT SHOULD NOT BE POSSIBLE TO REACH THIS STATE.',
      )
    }

    const txs = [...deploymentRealityModuleTxsMm.txs, ...safeSnapTxs]

    statusCallback('Setting up monitoring with OZ Defender')
    await setUpMonitoring(
      safeInfo.chainId as NETWORK,
      realityModuleAddress,
      setupData.oracle.instanceData.instanceAddress,
      setupData.monitoring,
    ).catch((e) => {
      statusCallback('Error when setting up monitoring.', e)
    })

    statusCallback('Proposing transactions to the Safe')
    await safeSdk.txs.send({ txs }).catch((e) => {
      statusCallback('Error when proposing transactions to the Safe', e)
    })
  } catch {
    statusCallback('Error when setting up transactions to add SafeSnap to the Snapshot Space')
  }
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
  provider: BrowserProvider,
  chainId: number,
  safeAddress: string,
  executorAddress: string,
  setupData: SetupData,
): Promise<TxsWitMeta> => {
  const bondToken = NETWORKS[chainId as NETWORK].nativeAsset
  const moduleDeploymentParameters: RealityModuleParams = {
    executor: executorAddress,
    bond: parseUnits(setupData.oracle.bondData.bond.toString(), bondToken.decimals).toString(),
    timeout: setupData.oracle.delayData.timeout.toString(),
    cooldown: setupData.oracle.delayData.cooldown.toString(),
    expiration: setupData.oracle.delayData.expiration.toString(),
    arbitrator: getArbitrator(chainId, setupData.oracle.arbitratorData.arbitratorOption),
    oracle: setupData.oracle.instanceData.instanceAddress,
  }
  return await deployRealityModule(
    provider,
    safeAddress,
    DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS,
    chainId,
    moduleDeploymentParameters,
    setupData.oracle.templateData,
  )
}

export const addSafeSnapToSettings = (
  originalSpaceSettings: any,
  chainId: number,
  realityModuleAddress: string,
) =>
  R.assocPath(
    ['plugins', 'safeSnap'],
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
