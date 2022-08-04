import { ethers } from "ethers";
import {
  deployRealityModule as deployRealityModuleInternal,
  RealityModuleParams as RealityModuleParamsInternal,
} from "services";
import { getNetworkNativeAsset } from "utils/networks";

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
  safeAddress: string;
  chainId: number;
  realityModuleParams: RealityModuleParams;
  safeSdk: any;
}

/**
 * Sets up the Reality Module.
 *
 * @notice The input variables are not checked for validity here, as this happens in the UI.
 */
export const setup = async ({
  safeAddress,
  chainId,
  realityModuleParams,
  safeSdk,
}: SetupParams) => {
  let txs = deployRealityModule(chainId, safeAddress, realityModuleParams);

  await safeSdk.txs.send({ txs });
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
const deployRealityModule = (
  chainId: number,
  safeAddress: string,
  params: RealityModuleParams
) => {
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
