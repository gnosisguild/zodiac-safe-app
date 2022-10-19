import {
  deployAndSetUpModule,
  getModuleInstance,
  KnownContracts,
} from "@gnosis.pm/zodiac"
import { enableModule, getDefaultOracle, getProvider } from "services"
import { Transaction } from "@gnosis.pm/safe-apps-sdk"
import { buildTransaction } from "services/helpers"

interface RealityModuleParams {
  executor: string
  oracle?: string
  bond: string
  templateId: string
  timeout: string
  cooldown: string
  expiration: string
  arbitrator: string
}

export function deployRealityModule(
  safeAddress: string,
  chainId: number,
  args: RealityModuleParams,
  isERC20?: boolean,
) {
  const type: KnownContracts = isERC20
    ? KnownContracts.REALITY_ERC20
    : KnownContracts.REALITY_ETH
  const {
    timeout,
    cooldown,
    expiration,
    bond,
    templateId,
    oracle,
    executor,
    arbitrator,
  } = args
  const provider = getProvider(chainId)
  const oracleAddress = oracle || getDefaultOracle(chainId)
  const {
    transaction: daoModuleDeploymentTx,
    expectedModuleAddress: daoModuleExpectedAddress,
  } = deployAndSetUpModule(
    type,
    {
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
    },
    provider,
    chainId,
    Date.now().toString(),
  )

  const daoModuleTransactions: Transaction[] = [
    {
      ...daoModuleDeploymentTx,
      value: daoModuleDeploymentTx.value.toString(),
    },
  ]

  if (executor !== safeAddress) {
    const delayModule = getModuleInstance(KnownContracts.DELAY, executor, provider)
    const addModuleTransaction = buildTransaction(delayModule, "enableModule", [
      daoModuleExpectedAddress,
    ])

    daoModuleTransactions.push(addModuleTransaction)
  } else {
    const enableDaoModuleTransaction = enableModule(
      safeAddress,
      chainId,
      daoModuleExpectedAddress,
    )
    daoModuleTransactions.push(enableDaoModuleTransaction)
  }

  return daoModuleTransactions
}
