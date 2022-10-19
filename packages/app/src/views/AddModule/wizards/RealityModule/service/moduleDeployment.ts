import { ethers } from "ethers"
import {
  enableModule,
  getDefaultOracle,
  getProvider,
  TxWitMeta,
} from "../../../../../services"
import {
  deployAndSetUpModule,
  getModuleInstance,
  KnownContracts,
} from "@gnosis.pm/zodiac"
import { Transaction } from "@gnosis.pm/safe-apps-sdk"
import { buildTransaction } from "services/helpers"
import { Data as OracleTemplateData } from "../sections/Oracle/components/OracleTemplate"
import DETERMINISTIC_DEPLOYMENT_HELPER_META from "../../../../../contracts/DeterministicDeploymentHelper.json"
export interface RealityModuleParams {
  executor: string
  oracle?: string
  bond: string
  timeout: string
  cooldown: string
  expiration: string
  arbitrator: string
}

// TODO: Add support for Reality.ETH oracles that is not known (for instance deployed by the caller)
// using `deployAndSetUpCustomModule` instead of `deployAndSetUpModule`
export async function deployRealityModule(
  safeAddress: string,
  deterministicDeploymentHelperAddress: string,
  chainId: number,
  args: RealityModuleParams,
  template: OracleTemplateData,
  isERC20?: boolean,
): Promise<TxWitMeta> {
  const oracleType: KnownContracts = isERC20
    ? KnownContracts.REALITY_ERC20
    : KnownContracts.REALITY_ETH
  const { timeout, cooldown, expiration, bond, oracle, executor, arbitrator } = args
  const provider = getProvider(chainId)
  const oracleAddress =
    oracle != null && ethers.utils.isAddress(oracle) ? oracle : getDefaultOracle(chainId)
  if (oracleAddress == null) {
    throw new Error(
      `No oracle address provided and no default oracle available for this chain (chainID: ${chainId})`,
    )
  }
  const saltNonce = Date.now().toString()
  const initData = {
    types: [
      "address",
      "address",
      "address",
      "address",
      "uint32",
      "uint32",
      "uint32",
      "uint256",
      "uint256",
      "address",
    ],
    values: [
      deterministicDeploymentHelperAddress,
      safeAddress,
      executor,
      oracleAddress,
      timeout,
      cooldown,
      expiration,
      bond,
      0, // templateId - must use 0 here, will be set up later
      arbitrator,
    ],
  }

  const { transaction: daoModuleDeploymentTx, expectedModuleAddress } =
    deployAndSetUpModule(oracleType, initData, provider, chainId, saltNonce)

  const daoModuleTransactions: Transaction[] = [
    {
      ...daoModuleDeploymentTx,
      value: daoModuleDeploymentTx.value.toString(),
    },
  ]

  if (executor !== safeAddress) {
    const delayModule = getModuleInstance(KnownContracts.DELAY, executor, provider)
    const addModuleTransaction = buildTransaction(delayModule, "enableModule", [
      expectedModuleAddress,
    ])

    daoModuleTransactions.push(addModuleTransaction)
  } else {
    const enableDaoModuleTransaction = enableModule(
      safeAddress,
      chainId,
      expectedModuleAddress,
    )
    daoModuleTransactions.push(enableDaoModuleTransaction)
  }

  const deterministicSetupHelper = new ethers.Contract(
    deterministicDeploymentHelperAddress,
    DETERMINISTIC_DEPLOYMENT_HELPER_META.abi,
    provider,
  )

  const populatedTemplateConfigurationTx =
    await deterministicSetupHelper.populateTransaction.createTemplateAndChangeOwner(
      expectedModuleAddress,
      oracleAddress,
      JSON.stringify({
        type: "bool",
        title: template.templateQuestion,
        category: "DAO proposal",
        lang: "en",
      }),
      safeAddress,
    )

  if (populatedTemplateConfigurationTx.to == null) {
    throw new Error("Missing to address")
  }
  if (populatedTemplateConfigurationTx.data == null) {
    throw new Error("Missing data")
  }

  daoModuleTransactions.push({
    to: populatedTemplateConfigurationTx.to,
    data: populatedTemplateConfigurationTx.data,
    value: "0",
  })

  return {
    txs: daoModuleTransactions,
    meta: { expectedModuleAddress },
  }
}
