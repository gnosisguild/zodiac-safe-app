import { ethers } from "ethers";
import {
  ARBITRATOR_OPTIONS,
  deployRealityModule as deployRealityModuleInternal,
  getArbitrator,
  RealityModuleParams as RealityModuleParamsInternal,
} from "../../services";
import { getNetworkNativeAsset } from "../../utils/networks";
import snapshot from "@snapshot-labs/snapshot.js";
import * as ipfs from "../../utils/ipfs";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import * as R from "ramda";
import { setTextRecordTx } from "utils/ens";
import { SdkInstance, SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { SetupData } from "./RealityModule";

const MULTI_SEND_CONTRACT = process.env.MULTI_SEND_CONTRACT;

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
  setupData: SetupData
) => {
  const deploymentRealityModuleTxs = deployRealityModuleTxs(
    safeInfo.chainId,
    safeInfo.safeAddress,
    executorAddress,
    setupData
  );
  const addSafeToSnapshotTxs = await addSafeSnapToSnapshotSpaceTxs(
    provider,
    setupData.proposal.ensName,
    setupData.oracle.instanceData.instanceAddress,
    safeInfo.chainId
  );

  const txs = [...deploymentRealityModuleTxs, ...addSafeToSnapshotTxs];

  await safeSdk.txs.send({ txs });

  await pokeSnapshotAPI(setupData.proposal.ensName); // TODO: if the transactions does not happen immediately, we need to poke the snapshot API in some other way later when the transactions is executed to make sure the new space settings is picked up.
};

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
const deployRealityModuleTxs = (
  chainId: number,
  safeAddress: string,
  executorAddress: string,
  setupData: SetupData
): Transaction[] => {
  const bondToken = getNetworkNativeAsset(chainId);
  const args: RealityModuleParamsInternal = {
    executor: executorAddress,
    bond: ethers.utils
      .parseUnits(setupData.oracle.bondData.bond.toString(), bondToken.decimals)
      .toString(),
    templateId: "0", // TODO: this is a "empty" template, we need to deploy a new template and add its id here
    timeout: setupData.oracle.delayData.timeout.toString(),
    cooldown: setupData.oracle.delayData.cooldown.toString(),
    expiration: setupData.oracle.delayData.expiration.toString(),
    arbitrator: getArbitrator(
      chainId,
      ARBITRATOR_OPTIONS.NO_ARBITRATOR // ToDo: hardcoded
    ),
    oracle: setupData.oracle.instanceData.instanceAddress,
  };
  console.log("args", args);
  console.log("safeAddress", safeAddress);
  console.log("chainId", chainId);
  return deployRealityModuleInternal(safeAddress, chainId, args, false);
};

export const addSafeSnapToSettings = (
  originalSpaceSettings: any,
  chainId: number,
  oracleAddress: string
) =>
  R.assocPath(
    ["plugins", "safeSnap"],
    {
      safes: [
        {
          network: chainId,
          realityAddress: oracleAddress,
          multisend: MULTI_SEND_CONTRACT,
        },
      ],
    },
    originalSpaceSettings
  );

const addSafeSnapToSnapshotSpaceTxs = async (
  provider: ethers.providers.JsonRpcProvider,
  ensName: string,
  oracleAddress: string,
  chainId: number
): Promise<Transaction[]> => {
  // 1. Get the current Space setting file.
  const ensResolver = await provider.getResolver(ensName);
  if (!ensResolver) {
    throw new Error(`ENS ${ensName} not found`);
  }
  const currentEnsSnapshotRecord = await ensResolver.getText("snapshot"); // for instance, "ipfs://QmWUemB5QDr6Zkp2tqQRcEW1ZC7n4MiLaE6CFneVJUeYyD"
  console.log("currentEnsSnapshotRecord", currentEnsSnapshotRecord);
  if (!currentEnsSnapshotRecord) {
    throw new Error(
      `ENS ${ensName} has no snapshot record, a Snapshot Space is required`
    );
  }
  const originalSpaceSettings = await ipfs.getJsonData(
    currentEnsSnapshotRecord
  );

  // 2. Update the Space setting file, by adding the SafeSnap plugin.
  const newSpaceSettings = addSafeSnapToSettings(
    originalSpaceSettings,
    chainId,
    oracleAddress
  );
  // validate the new schema
  if (
    !checkNewSnapshotSettingsValidity(originalSpaceSettings, newSpaceSettings)
  ) {
    throw new Error("The new settings file is changed in unexpected ways");
  }

  // 3. Deploy the modified settings file to IPFS.
  const cid = await ipfs.add(newSpaceSettings);

  // 4. Pin the new file. No need, as long as we keep it available in our local
  // IPFS node (running in the browser) until Snapshot picks it up, they will pin it..

  // 5. Sett the hash of the new setting file in the ENS snapshot record.
  const setEnsRecordTx = await setTextRecordTx(
    provider,
    ensName,
    "snapshot",
    cid.toString()
  );

  return [setEnsRecordTx];
};

export const checkNewSnapshotSettingsValidity = (
  originalSettings: any,
  newSettings: any
) =>
  R.and(
    // check that there are no unintended changes to the new Snapshot Space settings
    R.equals(
      R.omit(["plugins", "safeSnap"], originalSettings),
      R.omit(["plugins", "safeSnap"], newSettings)
    ),
    // validate the schema
    // we must be strict here, if not a truthy error value can be returned
    snapshot.utils.validateSchema(snapshot.schemas.space, newSettings) === true
  );

const pokeSnapshotAPI = async (ensName: string) => {
  fetch(`https://hub.snapshot.org/api/spaces/${ensName}/poke`);
};
