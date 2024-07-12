import { AbiCoder, Contract, Interface, BrowserProvider, FunctionFragment, ethers } from 'ethers'

import {
  calculateProxyAddress,
  deployAndSetUpModule,
  getModuleFactoryAndMasterCopy,
  getModuleInstance,
  KnownContracts,
} from '@gnosis.pm/zodiac'
import { AddressOne, buildTransaction, SafeAbi } from './helpers'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { getNetworkExplorerInfo } from '../utils/explorers'
import { SafeTransaction, SafeStatusResponse } from '../store/modules/models'
import { NETWORK } from '../utils/networks'
import { ERC721_CONTRACT_ABI } from './reality-eth'
import { scaleBondDecimals } from 'components/input/CollateralSelect'
import { FunctionOutputs } from 'hooks/useContractQuery'

export enum ARBITRATOR_OPTIONS {
  NO_ARBITRATOR,
  KLEROS,
  OTHER,
}

export type TxWitMeta = {
  txs: BaseTransaction[]
  meta?: { [key: string]: string }
}

interface TellorModuleParams {
  owner: string
  executor: string
  oracle?: string
  cooldown: string
  expiration: string
}

interface OptimisticGovernorModuleParams {
  executor: string
  owner: string
  collateral: string
  bond: string
  rules: string
  identifier: string
  liveness: string
}

interface DelayModuleParams {
  executor: string
  cooldown: string
  expiration: string
}

export interface RolesModifierParams {
  target: string
  multisend: string
}
export interface RolesV2ModifierParams {
  target: string
  multisend: string[]
}

export interface AMBModuleParams {
  amb: string
  controller: string
  executor: string
  chainId: string
}

export interface ExitModuleParams {
  executor: string
  tokenContract: string
}

export interface ConnextModuleParams {
  domainId: number
  sender: string
  owner: string
  avatar: string
  target: string
}

export function getTellorOracle(chainId: number): string {
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0xD9157453E2668B2fc45b7A803D3FEF3642430cC0'
    case NETWORK.POLYGON:
      return '0xD9157453E2668B2fc45b7A803D3FEF3642430cC0'
    case NETWORK.GNOSIS_CHAIN:
      return '0xD9157453E2668B2fc45b7A803D3FEF3642430cC0'
    case NETWORK.OPTIMISM:
      return '0xD9157453E2668B2fc45b7A803D3FEF3642430cC0'
    case NETWORK.ARBITRUM:
      return '0xD9157453E2668B2fc45b7A803D3FEF3642430cC0'
    case NETWORK.SEPOLIA:
      return '0x199839a4907ABeC8240D119B606C98c405Bb0B33'
    case NETWORK.BASE:
      return '' // TODO
  }
  return ''
}

export function getDefaultOracle(chainId: number): string {
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0x5b7dD1E86623548AF054A4985F7fc8Ccbb554E2c'
    case NETWORK.BSC:
      return '0xa925646Cae3721731F9a8C886E5D1A7B123151B9'
    case NETWORK.GNOSIS_CHAIN:
      return '0xE78996A233895bE74a66F451f1019cA9734205cc'
    case NETWORK.POLYGON:
      return '0x60573B8DcE539aE5bF9aD7932310668997ef0428'
    case NETWORK.OPTIMISM:
      return '0x0eF940F7f053a2eF5D6578841072488aF0c7d89A'
    case NETWORK.ARBITRUM:
      return '0x5D18bD4dC5f1AC8e9bD9B666Bd71cB35A327C4A9'
    case NETWORK.AVALANCHE:
      return '0xD88cd78631Ea0D068cedB0d1357a6eabe59D7502'
    case NETWORK.SEPOLIA:
      return '0xaf33DcB6E8c5c4D9dDF579f53031b514d19449CA'
    case NETWORK.BASE:
      return '' // TODO
  }
  return ''
}

export function getFinder(chainId: number): string {
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0x40f941E48A552bF496B154Af6bf55725f18D77c3'
    case NETWORK.POLYGON:
      return '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64'
    case NETWORK.SEPOLIA:
      return '0xf4C48eDAd256326086AEfbd1A53e1896815F8f13'
    case NETWORK.GNOSIS_CHAIN:
      return '0xeF684C38F94F48775959ECf2012D7E864ffb9dd4'
    case NETWORK.OPTIMISM:
      return '0x278d6b1aA37d09769E519f05FcC5923161A8536D'
    case NETWORK.ARBITRUM:
      return '0xB0b9f73B424AD8dc58156C2AE0D7A1115D1EcCd1'
    case NETWORK.AVALANCHE:
      return '0xCFdC4d6FdeC25e339ef07e25C35a482A6bedcfE0'
  }
  return ''
}

export function getCollateral(chainId: number, isWeth: boolean): string {
  if (isWeth) {
    return getWETHAddress(chainId)
  } else {
    return getUSDCAddress(chainId)
  }
}

function getUSDCAddress(chainId: number): string {
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    case NETWORK.POLYGON:
      return '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    case NETWORK.SEPOLIA:
      return '0xf08A50178dfcDe18524640EA6618a1f965821715'
    case NETWORK.GNOSIS_CHAIN:
      return '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'
    case NETWORK.OPTIMISM:
      return '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'
    case NETWORK.ARBITRUM:
      return '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
    case NETWORK.AVALANCHE:
      return '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'
  }
  return ''
}

function getWETHAddress(chainId: number): string {
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    case NETWORK.POLYGON:
      return '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    case NETWORK.SEPOLIA:
      return '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'
    case NETWORK.GNOSIS_CHAIN:
      return '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'
    case NETWORK.OPTIMISM:
      return '0x4200000000000000000000000000000000000006'
    case NETWORK.ARBITRUM:
      return '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
    case NETWORK.AVALANCHE:
      return '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB'
  }
  return ''
}

export function getKlerosAddress(chainId: number): string {
  // TODO: Add addresses when Kleros becomes available.
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0xf72cfd1b34a91a64f9a98537fe63fbab7530adca'
    case NETWORK.GNOSIS_CHAIN:
      return '0x29f39de98d750eb77b5fafb31b2837f079fce222'
    case NETWORK.POLYGON:
      return '0x5AFa42b30955f137e10f89dfb5EF1542a186F90e'
    case NETWORK.SEPOLIA:
      return '0x05b942faecfb3924970e3a28e0f230910cedff45'
  }
  return ''
}

export function getArbitrator(chainId: number, arbitratorOption: number): string {
  switch (arbitratorOption) {
    case ARBITRATOR_OPTIONS.NO_ARBITRATOR:
      // Setting the oracle as the arbitrator is equivalent to setting a null arbitrator.
      return getDefaultOracle(chainId)
    case ARBITRATOR_OPTIONS.KLEROS:
      return getKlerosAddress(chainId)
    case ARBITRATOR_OPTIONS.OTHER:
      return ''
  }
  return ''
}

export function getConnextAddress(chainId: number): string {
  switch (chainId) {
    case NETWORK.MAINNET:
      return '0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'
    case NETWORK.POLYGON:
      return '0x11984dc4465481512eb5b777E44061C158CF2259'
    case NETWORK.SEPOLIA:
      return '0x445fbf9cCbaf7d557fd771d56937E94397f43965'
    case NETWORK.GNOSIS_CHAIN:
      return '0x5bB83e95f63217CDa6aE3D181BA580Ef377D2109'
    case NETWORK.OPTIMISM:
      return '0x8f7492DE823025b4CfaAB1D34c58963F2af5DEDA'
    case NETWORK.ARBITRUM:
      return '0xEE9deC2712cCE65174B561151701Bf54b99C24C8'
  }
  return ''
}

export async function deployTellorModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: TellorModuleParams,
) {
  const type = KnownContracts.TELLOR
  const { owner, oracle, cooldown, expiration, executor } = args
  const oracleAddress = oracle || getTellorOracle(chainId)

  const { transaction: daoModuleDeploymentTx, expectedModuleAddress: daoModuleExpectedAddress } =
    await deployAndSetUpModule(
      type,
      {
        types: ['address', 'address', 'address', 'address', 'uint32', 'uint32'],
        values: [owner, safeAddress, executor, oracleAddress, cooldown, expiration],
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
    const address = await delayModule.getAddress()
    const addModuleTransaction = buildTransaction(delayModule.interface, address, 'enableModule', [
      daoModuleExpectedAddress,
    ])

    daoModuleTransactions.push(addModuleTransaction)
  } else {
    const enableDaoModuleTransaction = enableModule(safeAddress, daoModuleExpectedAddress)
    daoModuleTransactions.push(enableDaoModuleTransaction)
  }

  return daoModuleTransactions
}

export async function deployDelayModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: DelayModuleParams,
) {
  const { cooldown, expiration, executor } = args as unknown as DelayModuleParams
  const {
    transaction: delayModuleDeploymentTx,
    expectedModuleAddress: delayModuleExpectedAddress,
  } = await deployAndSetUpModule(
    KnownContracts.DELAY,
    {
      types: ['address', 'address', 'address', 'uint256', 'uint256'],
      values: [safeAddress, safeAddress, executor, cooldown, expiration],
    },
    provider,
    chainId,
    Date.now().toString(),
  )
  const enableDelayModuleTransaction = enableModule(safeAddress, delayModuleExpectedAddress)

  return [
    {
      ...delayModuleDeploymentTx,
      value: delayModuleDeploymentTx.value.toString(),
    },
    enableDelayModuleTransaction,
  ]
}

export async function deployBridgeModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: AMBModuleParams,
) {
  const { executor, controller, amb, chainId: ambChainId } = args

  const { transaction, expectedModuleAddress } = await deployAndSetUpModule(
    KnownContracts.BRIDGE,
    {
      types: ['address', 'address', 'address', 'address', 'address', 'bytes32'],
      values: [
        safeAddress,
        safeAddress,
        executor,
        amb,
        controller,
        ethers.zeroPadValue(ethers.toBeHex(ambChainId), 32),
      ],
    },
    provider,
    chainId,
    Date.now().toString(),
  )
  const enableModuleTransaction = enableModule(safeAddress, expectedModuleAddress)

  return [
    {
      ...transaction,
      value: transaction.value.toString(),
    },
    enableModuleTransaction,
  ]
}

export async function deployCirculatingSupplyContract(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  token: string,
  saltNonce: string,
  isERC721?: boolean,
) {
  const type: KnownContracts = isERC721
    ? KnownContracts.CIRCULATING_SUPPLY_ERC721
    : KnownContracts.CIRCULATING_SUPPLY_ERC20

  const { moduleFactory, moduleMastercopy: circulatingSupplyContract } =
    getModuleFactoryAndMasterCopy(type, provider, chainId)

  const encodedInitParams = new AbiCoder().encode(
    ['address', 'address', 'address[]'],
    [safeAddress, token, [safeAddress]],
  )
  const moduleSetupData = circulatingSupplyContract.interface.encodeFunctionData('setUp', [
    encodedInitParams,
  ])

  const circulatingSupplyContractAddress = await circulatingSupplyContract.getAddress()
  const expectedAddress = await calculateProxyAddress(
    moduleFactory as unknown as Contract,
    circulatingSupplyContractAddress,
    moduleSetupData,
    saltNonce,
  )

  const deployData = moduleFactory.interface.encodeFunctionData('deployModule', [
    circulatingSupplyContractAddress,
    moduleSetupData,
    saltNonce,
  ])

  const transaction = {
    data: deployData,
    to: await moduleFactory.getAddress(),
    value: '0',
  }
  return {
    transaction,
    expectedAddress,
  }
}

export async function deployExitModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: ExitModuleParams,
) {
  const txs: BaseTransaction[] = []
  const { executor, tokenContract } = args

  let isERC721 = false
  try {
    const ERC721Contract = new Contract(tokenContract, ERC721_CONTRACT_ABI, provider)
    isERC721 = await ERC721Contract.supportsInterface('0x80ac58cd')
  } catch (err) {
    console.warn('deployExitModule: error determining token type')
  }

  const { transaction: deployCirculationSupplyTx, expectedAddress: circulatingSupplyAddress } =
    await deployCirculatingSupplyContract(
      provider,
      safeAddress,
      chainId,
      tokenContract,
      Date.now().toString(),
      isERC721,
    )

  txs.push(deployCirculationSupplyTx)

  const type = isERC721 ? KnownContracts.EXIT_ERC721 : KnownContracts.EXIT_ERC20

  const { transaction, expectedModuleAddress } = await deployAndSetUpModule(
    type,
    {
      types: ['address', 'address', 'address', 'address', 'address'],
      values: [safeAddress, safeAddress, executor, tokenContract, circulatingSupplyAddress],
    },
    provider,
    chainId,
    Date.now().toString(),
  )
  txs.push({
    ...transaction,
    value: transaction.value.toString(),
  })

  const enableModuleTransaction = enableModule(safeAddress, expectedModuleAddress)
  txs.push(enableModuleTransaction)

  return txs
}

export async function fetchSafeModulesAddress(provider: BrowserProvider, safeAddress: string) {
  const safe = new Contract(safeAddress, SafeAbi, provider)
  const [modules] = await safe.getModulesPaginated(AddressOne, 50)
  return modules as string[]
}

export function enableModule(safeAddress: string, module: string) {
  return buildTransaction(new Interface(SafeAbi), safeAddress, 'enableModule', [module])
}

export async function disableModule(
  provider: BrowserProvider,
  safeAddress: string,
  module: string,
) {
  const modules = await fetchSafeModulesAddress(provider, safeAddress)
  if (!modules.length) throw new Error('Safe does not have enabled modules')
  let prevModule = AddressOne
  if (modules.length > 1) {
    const moduleIndex = modules.findIndex((m) => m.toLowerCase() === module.toLowerCase())
    if (moduleIndex > 0) prevModule = modules[moduleIndex - 1]
  }
  const params = [prevModule, module]
  return {
    params,
    ...buildTransaction(new Interface(SafeAbi), safeAddress, 'disableModule', params),
  }
}

export const callContract = async (
  provider: BrowserProvider,
  chainId: number,
  address: string,
  abi: FunctionFragment[],
  method: string,
  data: any[] = [],
): Promise<FunctionOutputs> => {
  const contract = new Contract(address, abi, provider)

  if (typeof contract[method] === 'function') {
    return await contract[method](...data)
  } else {
    const value = contract[method]
    return value as unknown as FunctionOutputs
  }
}

export async function fetchSafeBalanceInfo(chainId: number, safeAddress: string) {
  const network = getNetworkExplorerInfo(chainId)
  if (!network) return []

  const url = new URL(
    `api/v1/safes/${safeAddress}/balances/?trusted=false&exclude_spam=false`,
    network.safeTransactionApi,
  )

  const request = await fetch(url.toString())
  const response = await request.json()

  return response.results
}

export async function fetchSafeTransactions(
  chainId: number,
  safeAddress: string,
  params: Record<string, string>,
) {
  const network = getNetworkExplorerInfo(chainId)
  if (!network) return []

  const url = new URL(`api/v1/safes/${safeAddress}/transactions`, network.safeTransactionApi)

  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))

  const request = await fetch(url.toString())
  const response = await request.json()

  return response.results as SafeTransaction[]
}

export async function fetchSafeStatusFromAPI(chainId: number, safeAddress: string) {
  const network = getNetworkExplorerInfo(chainId)
  if (!network) throw new Error('invalid network')

  const url = new URL(`api/v1/safes/${safeAddress}`, network.safeTransactionApi)

  const request = await fetch(url.toString())
  const response = await request.json()
  return response as SafeStatusResponse
}

export async function deployRolesV1Modifier(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: RolesModifierParams,
) {
  const { target, multisend } = args
  const { transaction: deployAndSetupTx, expectedModuleAddress: expectedRolesAddress } =
    await deployAndSetUpModule(
      KnownContracts.ROLES_V1,
      {
        types: ['address', 'address', 'address'],
        values: [safeAddress, safeAddress, target],
      },
      provider,
      chainId,
      Date.now().toString(),
    )
  const enableModuleTx = enableModule(safeAddress, expectedRolesAddress)

  const rolesContract = getModuleInstance(KnownContracts.ROLES_V1, expectedRolesAddress, provider)
  const rolesContractAddress = await rolesContract.getAddress()
  const setMultisendTx = buildTransaction(
    rolesContract.interface,
    rolesContractAddress,
    'setMultisend',
    [multisend],
  )

  return [
    {
      ...deployAndSetupTx,
      value: '0x' + deployAndSetupTx.value.toString(16),
    },
    enableModuleTx,
    setMultisendTx,
  ]
}

export async function deployRolesV2Modifier(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: RolesV2ModifierParams,
) {
  const { target, multisend } = args
  const { transaction: deployAndSetupTx, expectedModuleAddress: expectedRolesAddress } =
    await deployAndSetUpModule(
      KnownContracts.ROLES_V2,
      {
        types: ['address', 'address', 'address'],
        values: [safeAddress, safeAddress, target],
      },
      provider,
      chainId,
      Date.now().toString(),
    )
  const enableModuleTx = enableModule(safeAddress, expectedRolesAddress)

  const rolesContract = getModuleInstance(KnownContracts.ROLES_V2, expectedRolesAddress, provider)

  const MULTISEND_SELECTOR = '0x8d80ff0a'
  const MULTISEND_UNWRAPPER = '0x93B7fCbc63ED8a3a24B59e1C3e6649D50B7427c0'
  const rolesContractAddress = await rolesContract.getAddress()
  const setUnwrapperTxs = multisend.map((address) => ({
    to: rolesContractAddress,
    data: rolesContract.interface.encodeFunctionData('setTransactionUnwrapper', [
      address,
      MULTISEND_SELECTOR,
      MULTISEND_UNWRAPPER,
    ]),
    value: '0',
  }))

  return [
    {
      ...deployAndSetupTx,
      value: '0x' + deployAndSetupTx.value.toString(16),
    },
    enableModuleTx,
    ...setUnwrapperTxs,
  ]
}

export async function deployOptimisticGovernorModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: OptimisticGovernorModuleParams,
  isWeth: boolean,
) {
  const type = KnownContracts.OPTIMISTIC_GOVERNOR

  const { executor, collateral, bond, rules, identifier, liveness } = args

  const scaledBond = scaleBondDecimals(bond, isWeth).toString()

  const { transaction: daoModuleDeploymentTx, expectedModuleAddress: daoModuleExpectedAddress } =
    await deployAndSetUpModule(
      type,
      {
        types: ['address', 'address', 'uint256', 'string', 'bytes32', 'uint64'],
        values: [executor, collateral, scaledBond, rules, identifier, liveness],
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
    const addModuleTransaction = buildTransaction(
      delayModule.interface,
      await delayModule.getAddress(),
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

export async function deployConnextModule(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: ConnextModuleParams,
) {
  const type = KnownContracts.CONNEXT
  const { domainId, sender, owner, avatar, target } = args
  const connextAddress = getConnextAddress(chainId)
  const {
    transaction: connextModuleDeploymentTx,
    expectedModuleAddress: connextModuleExpectedAddress,
  } = await deployAndSetUpModule(
    type,
    {
      types: ['address', 'address', 'address', 'address', 'uint32', 'address'],
      values: [owner, avatar, target, sender, domainId, connextAddress],
    },
    provider,
    chainId,
    Date.now().toString(),
  )

  const connextModuleTransactions: BaseTransaction[] = [
    {
      ...connextModuleDeploymentTx,
      value: connextModuleDeploymentTx.value.toString(),
    },
  ]

  const enableConnextModuleTransaction = enableModule(safeAddress, connextModuleExpectedAddress)
  connextModuleTransactions.push(enableConnextModuleTransaction)

  return connextModuleTransactions
}
