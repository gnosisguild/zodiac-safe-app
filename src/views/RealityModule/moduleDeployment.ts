import { ethers } from "ethers"
import { enableModule, getDefaultOracle, getProvider, TxWitMeta } from "../../services"
import {
  calculateProxyAddress,
  deployAndSetUpModule,
  getFactoryAndMasterCopy,
  getModuleInstance,
  KnownContracts,
} from "@gnosis.pm/zodiac"
import { Transaction } from "@gnosis.pm/safe-apps-sdk"
import { buildTransaction } from "services/helpers"
export interface RealityModuleParams {
  executor: string
  oracle?: string
  bond: string
  templateId: string
  timeout: string
  cooldown: string
  expiration: string
  arbitrator: string
}

// TODO: Add support for Reality.ETH oracles that is not known (for instance deployed by the caller)
// using `deployAndSetUpCustomModule` instead of `deployAndSetUpModule`
export function deployRealityModule(
  safeAddress: string,
  chainId: number,
  args: RealityModuleParams,
  isERC20?: boolean,
): TxWitMeta {
  const oracleType: KnownContracts = isERC20 ? KnownContracts.REALITY_ERC20 : KnownContracts.REALITY_ETH
  const { timeout, cooldown, expiration, bond, templateId, oracle, executor, arbitrator } = args
  const provider = getProvider(chainId)
  const oracleAddress = oracle != null && ethers.utils.isAddress(oracle) ? oracle : getDefaultOracle(chainId)
  const saltNonce = Date.now().toString()
  const initData = {
    types: ["address", "address", "address", "address", "uint32", "uint32", "uint32", "uint256", "uint256", "address"],
    values: [
      safeAddress,
      safeAddress,
      executor,
      oracleAddress,
      timeout,
      cooldown,
      expiration,
      bond,
      templateId,
      arbitrator,
    ],
  }
  const { transaction: daoModuleDeploymentTx, expectedModuleAddress: daoModuleExpectedAddress } = deployAndSetUpModule(
    oracleType,
    initData,
    provider,
    chainId,
    saltNonce,
  )

  const daoModuleTransactions: Transaction[] = [
    {
      ...daoModuleDeploymentTx,
      value: daoModuleDeploymentTx.value.toString(),
    },
  ]

  if (executor !== safeAddress) {
    const delayModule = getModuleInstance(KnownContracts.DELAY, executor, provider)
    const addModuleTransaction = buildTransaction(delayModule, "enableModule", [daoModuleExpectedAddress])

    daoModuleTransactions.push(addModuleTransaction)
  } else {
    const enableDaoModuleTransaction = enableModule(safeAddress, chainId, daoModuleExpectedAddress)
    daoModuleTransactions.push(enableDaoModuleTransaction)
  }

  return {
    txs: daoModuleTransactions,
    meta: { addressWhenDeployed: calculateRealityModuleAddress(oracleType, initData, provider, chainId, saltNonce) },
  }
}

export const calculateRealityModuleAddress = (
  oracleType: KnownContracts.REALITY_ETH | KnownContracts.REALITY_ERC20,
  args: {
    types: string[]
    values: string[]
  },
  provider: ethers.providers.JsonRpcProvider,
  chainId: number,
  saltNonce: string,
): string => {
  const { factory, module } = getFactoryAndMasterCopy(oracleType, provider, chainId)
  const encodedInitParams = ethers.utils.defaultAbiCoder.encode(args.types, args.values)
  return calculateProxyAddress(factory, module.address, encodedInitParams, saltNonce)
}
