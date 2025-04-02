import { deployAndSetUpModule, getModuleInstance, KnownContracts } from '@gnosis-guild/zodiac'
import { enableModule, getDefaultOracle } from 'services'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { buildTransaction } from 'services/helpers'
import { BrowserProvider } from 'ethers'

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

export async function deployRealityModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: RealityModuleParams,
  isERC20?: boolean,
) {
  const type: KnownContracts = isERC20 ? KnownContracts.REALITY_ERC20 : KnownContracts.REALITY_ETH
  const { timeout, cooldown, expiration, bond, templateId, oracle, executor, arbitrator } = args
  const oracleAddress = oracle || getDefaultOracle(chainId)
  const { transaction: daoModuleDeploymentTx, expectedModuleAddress: daoModuleExpectedAddress } =
    await deployAndSetUpModule(
      type,
      {
        types: [
          'address',
          'address',
          'address',
          'address',
          'uint32',
          'uint32',
          'uint32',
          'uint256',
          'uint256',
          'address',
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

  const daoModuleTransactions: BaseTransaction[] = [
    {
      ...daoModuleDeploymentTx,
      value: daoModuleDeploymentTx.value.toString(),
    },
  ]

  if (executor !== safeAddress) {
    const delayModule = getModuleInstance(KnownContracts.DELAY, executor, provider)
    const delayModuleAddress = await delayModule.getAddress()
    const addModuleTransaction = buildTransaction(
      delayModule.interface,
      delayModuleAddress,
      'enableModule',
      [daoModuleExpectedAddress],
    )

    daoModuleTransactions.push(addModuleTransaction)
  } else {
    const enableDaoModuleTransaction = enableModule(safeAddress, daoModuleExpectedAddress)
    daoModuleTransactions.push(enableDaoModuleTransaction)
  }

  return daoModuleTransactions
}
