import {
  encodeDeployProxy,
  KnownContracts,
  predictProxyAddress,
} from '@gnosis-guild/zodiac'
import { ModuleType, ZodiacHelperContractVersion } from 'store/modules/models'
import { getMastercopyAddress, getModuleInstance, getZodiacContractAddress } from 'utils/zodiac'
import { enableModule, getDefaultOracle } from 'services'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { buildTransaction } from 'services/helpers'
import { BrowserProvider } from 'ethers'

const MODULE_PROXY_FACTORY = getZodiacContractAddress(
  KnownContracts.FACTORY,
  ZodiacHelperContractVersion.FACTORY,
)

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

export async function createRealityDeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: RealityModuleParams,
  isERC20?: boolean,
) {
  const { timeout, cooldown, expiration, bond, templateId, oracle, executor, arbitrator } = args
  const oracleAddress = oracle || getDefaultOracle(chainId)
  const setupArgs = {
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
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(
    isERC20 ? ModuleType.REALITY_ERC20 : ModuleType.REALITY_ETH,
  )
  const daoModuleDeploymentTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const daoModuleExpectedAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })

  const daoModuleTransactions: BaseTransaction[] = [
    {
      to: String(daoModuleDeploymentTx.to),
      data: String(daoModuleDeploymentTx.data),
      value: '0',
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
