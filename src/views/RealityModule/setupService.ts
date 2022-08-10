import { ethers } from "ethers";
import {
  deployRealityModule as deployRealityModuleInternal,
  RealityModuleParams as RealityModuleParamsInternal,
} from "../../services";
import { getNetworkNativeAsset } from "../../utils/networks";
import snapshot from "@snapshot-labs/snapshot.js";
import * as ipfs from "../../utils/ipfs";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import R from "ramda";

const MULTI_SEND_CONTRACT = process.env.MULTI_SEND_CONTRACT;

export interface RealityModuleParams {
  executorAddress: string;
  oracleAddress: string;
  minimumBond: number;
  templateId: string;
  timeoutInSeconds: number;
  cooldownInSeconds: number;
  expirationInSeconds: number;
  arbitratorAddress: string;
  // bondTokenAddress: string; // using the network native asset for now
}

export interface SetupParams {
  provider: ethers.providers.JsonRpcProvider;
  safeAddress: string;
  chainId: number;
  ensName: string;
  realityModuleParams: RealityModuleParams;
  safeSdk: any;
}

/**
 * Sets up the Reality Module.
 *
 * @notice The input variables are not checked for validity here, as this happens in the UI.
 */
export const setup = async ({
  provider,
  safeAddress,
  chainId,
  realityModuleParams,
  safeSdk,
  ensName,
}: SetupParams) => {
  const deploymentRealityModuleTxs = deployRealityModuleTx(
    chainId,
    safeAddress,
    realityModuleParams
  );
  const addSafeToSnapshotTxs = await addSafeSnapToSnapshotSpaceTx(
    provider,
    ensName,
    realityModuleParams.oracleAddress,
    chainId
  );

  const txs = [...deploymentRealityModuleTxs, ...addSafeToSnapshotTxs];

  await safeSdk.txs.send({ txs });

  await pokeSnapshotAPI();
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
const deployRealityModuleTx = (
  chainId: number,
  safeAddress: string,
  params: RealityModuleParams
): Transaction[] => {
  const {
    executorAddress,
    oracleAddress,
    minimumBond,
    templateId,
    timeoutInSeconds,
    cooldownInSeconds,
    expirationInSeconds,
    arbitratorAddress,
  } = params;
  const bondToken = getNetworkNativeAsset(chainId);
  const args: RealityModuleParamsInternal = {
    executor: executorAddress ?? safeAddress,
    bond: ethers.utils
      .parseUnits(minimumBond.toString(), bondToken.decimals)
      .toString(),
    templateId: templateId,
    timeout: timeoutInSeconds.toString(),
    cooldown: cooldownInSeconds.toString(),
    expiration: expirationInSeconds.toString(),
    arbitrator: arbitratorAddress,
    oracle: oracleAddress,
  };
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

const addSafeSnapToSnapshotSpaceTx = async (
  provider: ethers.providers.JsonRpcProvider,
  ensName: string,
  realityAddress: string,
  chainId: number
): Promise<Transaction[]> => {
  // 1. Get the current Space setting file.
  const ensResolver = await provider.getResolver(ensName);
  if (!ensResolver) {
    throw new Error(`ENS ${ensName} not found`);
  }
  const currentEnsSnapshotRecord = await ensResolver.getText("snapshot"); // for instance, "ipfs://QmWUemB5QDr6Zkp2tqQRcEW1ZC7n4MiLaE6CFneVJUeYyD"
  const originalSpaceSettings = await ipfs.getJsonData(
    currentEnsSnapshotRecord
  );

  // 2. Update the Space setting file, by adding the SafeSnap plugin.
  const newSpaceSettings = addSafeSnapToSettings(
    originalSpaceSettings,
    chainId,
    realityAddress
  );
  // validate the new schema
  if (
    !checkNewSnapshotSettingsValidity(originalSpaceSettings, newSpaceSettings)
  ) {
    throw new Error("The new settings file is changed in unexpected ways");
  }

  // 3. Deploy the modified settings file to IPFS.
  const cid = await ipfs.add(newSpaceSettings);

  // 4. Pin the new file.

  // 5. Sett the hash of the new setting file in the ENS snapshot record.

  return [];
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

const pokeSnapshotAPI = async () => {};
