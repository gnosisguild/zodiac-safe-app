import { BrowserProvider, ethers, isAddress } from 'ethers'
import { enableModule, getDefaultOracle, TxWitMeta } from '../../../../../services'
import {
  encodeDeployProxy,
  KnownContracts,
  predictProxyAddress,
} from '@gnosis-guild/zodiac'
import { ModuleType, ZodiacHelperContractVersion } from 'store/modules/models'
import { getMastercopyAddress, getModuleInstance, getZodiacContractAddress } from 'utils/zodiac'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { buildTransaction } from 'services/helpers'
import { Data as OracleTemplateData } from '../sections/Oracle/components/OracleTemplate'
import DETERMINISTIC_DEPLOYMENT_HELPER_META from '../../../../../contracts/DeterministicDeploymentHelper.json'

const MODULE_PROXY_FACTORY = getZodiacContractAddress(
  KnownContracts.FACTORY,
  ZodiacHelperContractVersion.FACTORY,
)

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
export async function createRealityDeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  deterministicDeploymentHelperAddress: string,
  chainId: number,
  args: RealityModuleParams,
  template: OracleTemplateData,
  isERC20?: boolean,
): Promise<TxWitMeta> {
  const { timeout, cooldown, expiration, bond, oracle, executor, arbitrator } = args
  const oracleAddress = oracle != null && isAddress(oracle) ? oracle : getDefaultOracle(chainId)
  if (oracleAddress == null) {
    throw new Error(
      `No oracle address provided and no default oracle available for this chain (chainID: ${chainId})`,
    )
  }
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
  const signer = await provider.getSigner()
  const deterministicSetupHelper = new ethers.Contract(
    deterministicDeploymentHelperAddress,
    DETERMINISTIC_DEPLOYMENT_HELPER_META.abi,
    signer.provider,
  )
  console.log('deterministicSetupHelper', deterministicSetupHelper)

  const populatedTemplateConfigurationTx =
    await deterministicSetupHelper.createTemplateAndChangeOwner.populateTransaction(
      daoModuleExpectedAddress,
      oracleAddress,
      JSON.stringify({
        type: 'bool',
        title: template.templateQuestion,
        category: 'DAO proposal',
        lang: 'en',
      }),
      safeAddress,
    )

  if (populatedTemplateConfigurationTx.to == null) {
    throw new Error('Missing to address')
  }
  if (populatedTemplateConfigurationTx.data == null) {
    throw new Error('Missing data')
  }

  daoModuleTransactions.push({
    to: populatedTemplateConfigurationTx.to,
    data: populatedTemplateConfigurationTx.data,
    value: '0',
  })

  return {
    txs: daoModuleTransactions,
    meta: { daoModuleExpectedAddress },
  }
}
