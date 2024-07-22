import { BrowserProvider, ethers, isAddress } from 'ethers'
import { enableModule, getDefaultOracle, TxWitMeta } from '../../../../../services'
import { deployAndSetUpModule, getModuleInstance, KnownContracts } from '@gnosis.pm/zodiac'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { buildTransaction } from 'services/helpers'
import { Data as OracleTemplateData } from '../sections/Oracle/components/OracleTemplate'
import DETERMINISTIC_DEPLOYMENT_HELPER_META from '../../../../../contracts/DeterministicDeploymentHelper.json'
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
export async function deployRealityModule(
  provider: BrowserProvider,
  safeAddress: string,
  deterministicDeploymentHelperAddress: string,
  chainId: number,
  args: RealityModuleParams,
  template: OracleTemplateData,
  isERC20?: boolean,
): Promise<TxWitMeta>{
  const type: KnownContracts = isERC20 ? KnownContracts.REALITY_ERC20 : KnownContracts.REALITY_ETH
  const { timeout, cooldown, expiration, bond, oracle, executor, arbitrator } = args
  const oracleAddress = oracle != null && isAddress(oracle) ? oracle : getDefaultOracle(chainId)
  if (oracleAddress == null) {
    throw new Error(
      `No oracle address provided and no default oracle available for this chain (chainID: ${chainId})`,
    )
  }
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
  const signer = await provider.getSigner()
  const deterministicSetupHelper = new ethers.Contract(
    deterministicDeploymentHelperAddress,
    DETERMINISTIC_DEPLOYMENT_HELPER_META.abi,
    signer.provider,
  )
  console.log('deterministicSetupHelper', deterministicSetupHelper)

  const populatedTemplateConfigurationTx = await deterministicSetupHelper.createTemplateAndChangeOwner.populateTransaction(
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
