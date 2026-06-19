import { Contract, Interface, BrowserProvider, FunctionFragment, ethers } from 'ethers'

import { encodeDeployProxy, KnownContracts, predictProxyAddress } from '@gnosis-guild/zodiac'
import { getMastercopyAddress, getModuleInstance, getZodiacContractAddress } from 'utils/zodiac'
import { AddressOne, buildTransaction, SafeAbi } from './helpers'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { getNetworkExplorerInfo } from '../utils/explorers'
import {
  ModuleType,
  ModuleVersion,
  SafeTransaction,
  SafeStatusResponse,
  ZodiacHelperContractVersion,
} from '../store/modules/models'
import { NETWORK } from '../utils/networks'
import { ERC721_CONTRACT_ABI } from './reality-eth'
import { scaleBondDecimals } from 'components/input/CollateralSelect'
import { FunctionOutputs } from 'hooks/useContractQuery'

const MODULE_PROXY_FACTORY = getZodiacContractAddress(
  KnownContracts.FACTORY,
  ZodiacHelperContractVersion.FACTORY,
)

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
      return '0x2F39f464d16402Ca3D8527dA89617b73DE2F60e8'
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
    case NETWORK.BASE:
      return '0xBeeB211CfE6632E75992488A66F65b0477FBe96B'
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

export async function createTellorDeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  chainId: number,
  args: TellorModuleParams,
) {
  const { owner, oracle, cooldown, expiration, executor } = args
  const oracleAddress = oracle || getTellorOracle(chainId)
  const setupArgs = {
    types: ['address', 'address', 'address', 'address', 'uint32', 'uint32'],
    values: [owner, safeAddress, executor, oracleAddress, cooldown, expiration],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.TELLOR)
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

export async function createDelayDeploymentTx(safeAddress: string, args: DelayModuleParams) {
  const { cooldown, expiration, executor } = args
  const setupArgs = {
    types: ['address', 'address', 'address', 'uint256', 'uint256'],
    values: [safeAddress, safeAddress, executor, cooldown, expiration],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.DELAY)
  const delayModuleDeploymentTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const delayModuleExpectedAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const enableDelayModuleTransaction = enableModule(safeAddress, delayModuleExpectedAddress)

  return [
    {
      to: String(delayModuleDeploymentTx.to),
      data: String(delayModuleDeploymentTx.data),
      value: '0',
    },
    enableDelayModuleTransaction,
  ]
}

export async function createBridgeDeploymentTx(safeAddress: string, args: AMBModuleParams) {
  const { executor, controller, amb, chainId: ambChainId } = args
  const setupArgs = {
    types: ['address', 'address', 'address', 'address', 'address', 'bytes32'],
    values: [
      safeAddress,
      safeAddress,
      executor,
      amb,
      controller,
      ethers.zeroPadValue(ethers.toBeHex(ambChainId), 32),
    ],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.BRIDGE)
  const transaction = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const expectedModuleAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const enableModuleTransaction = enableModule(safeAddress, expectedModuleAddress)

  return [
    {
      to: String(transaction.to),
      data: String(transaction.data),
      value: '0',
    },
    enableModuleTransaction,
  ]
}

export async function createCirculatingSupplyDeploymentTx(
  safeAddress: string,
  token: string,
  saltNonce: string,
  isERC721?: boolean,
) {
  const type: KnownContracts = isERC721
    ? KnownContracts.CIRCULATING_SUPPLY_ERC721
    : KnownContracts.CIRCULATING_SUPPLY_ERC20

  const setupArgs = {
    types: ['address', 'address', 'address[]'],
    values: [safeAddress, token, [safeAddress]],
  }
  const mastercopy = getZodiacContractAddress(type, ZodiacHelperContractVersion.CIRCULATING_SUPPLY)
  const transaction = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const expectedAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  return {
    transaction: {
      to: String(transaction.to),
      data: String(transaction.data),
      value: '0',
    },
    expectedAddress,
  }
}

export async function createExitDeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  args: ExitModuleParams,
) {
  const txs: BaseTransaction[] = []
  const { executor, tokenContract } = args

  let isERC721 = false
  try {
    const ERC721Contract = new Contract(tokenContract, ERC721_CONTRACT_ABI, provider)
    isERC721 = await ERC721Contract.supportsInterface('0x80ac58cd')
  } catch (err) {
    console.warn('createExitDeploymentTx: error determining token type')
  }

  const { transaction: createCirculationSupplyTx, expectedAddress: circulatingSupplyAddress } =
    await createCirculatingSupplyDeploymentTx(
      safeAddress,
      tokenContract,
      Date.now().toString(),
      isERC721,
    )

  txs.push(createCirculationSupplyTx)

  const setupArgs = {
    types: ['address', 'address', 'address', 'address', 'address'],
    values: [safeAddress, safeAddress, executor, tokenContract, circulatingSupplyAddress],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = isERC721
    ? getZodiacContractAddress(KnownContracts.EXIT_ERC721, ModuleVersion[ModuleType.EXIT])
    : getMastercopyAddress(ModuleType.EXIT)
  const transaction = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const expectedModuleAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  txs.push({
    to: String(transaction.to),
    data: String(transaction.data),
    value: '0',
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

  const url = new URL(
    `api/v1/safes/${safeAddress}/multisig-transactions`,
    network.safeTransactionApi,
  )

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

export async function createRolesV1DeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  args: RolesModifierParams,
) {
  const { target, multisend } = args
  const setupArgs = {
    types: ['address', 'address', 'address'],
    values: [safeAddress, safeAddress, target],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.ROLES_V1)
  const createAndSetupTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const expectedRolesAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const enableModuleTx = enableModule(safeAddress, expectedRolesAddress)

  const rolesContract = getModuleInstance(
    KnownContracts.ROLES,
    expectedRolesAddress,
    provider,
    ModuleVersion[ModuleType.ROLES_V1],
  )
  const rolesContractAddress = await rolesContract.getAddress()
  const setMultisendTx = buildTransaction(
    rolesContract.interface,
    rolesContractAddress,
    'setMultisend',
    [multisend],
  )

  return [
    {
      to: String(createAndSetupTx.to),
      data: String(createAndSetupTx.data),
      value: '0',
    },
    enableModuleTx,
    setMultisendTx,
  ]
}

export async function createRolesV2DeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  args: RolesV2ModifierParams,
) {
  const { target, multisend } = args
  const setupArgs = {
    types: ['address', 'address', 'address'],
    values: [safeAddress, safeAddress, target],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.ROLES_V2)
  const createAndSetupTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const expectedRolesAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const enableModuleTx = enableModule(safeAddress, expectedRolesAddress)

  const rolesContract = getModuleInstance(
    KnownContracts.ROLES,
    expectedRolesAddress,
    provider,
    ModuleVersion[ModuleType.ROLES_V2],
  )

  const MULTISEND_SELECTOR = '0x8d80ff0a'
  const MULTISEND_UNWRAPPER = '0xB4Cd4bb764C089f20DA18700CE8bc5e49F369efD'
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
      to: String(createAndSetupTx.to),
      data: String(createAndSetupTx.data),
      value: '0',
    },
    enableModuleTx,
    ...setUnwrapperTxs,
  ]
}

export async function createOptimisticGovernorDeploymentTx(
  provider: BrowserProvider,
  safeAddress: string,
  args: OptimisticGovernorModuleParams,
  isWeth: boolean,
) {
  const { executor, collateral, bond, rules, identifier, liveness } = args

  const scaledBond = scaleBondDecimals(bond, isWeth).toString()
  const setupArgs = {
    types: ['address', 'address', 'uint256', 'string', 'bytes32', 'uint64'],
    values: [executor, collateral, scaledBond, rules, identifier, liveness],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.OPTIMISTIC_GOVERNOR)
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

export async function createConnextDeploymentTx(
  safeAddress: string,
  chainId: number,
  args: ConnextModuleParams,
) {
  const { domainId, sender, owner, avatar, target } = args
  const connextAddress = getConnextAddress(chainId)
  const setupArgs = {
    types: ['address', 'address', 'address', 'address', 'uint32', 'address'],
    values: [owner, avatar, target, sender, domainId, connextAddress],
  }
  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.CONNEXT)
  const connextModuleDeploymentTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })
  const connextModuleExpectedAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs,
    saltNonce,
  })

  const connextModuleTransactions: BaseTransaction[] = [
    {
      to: String(connextModuleDeploymentTx.to),
      data: String(connextModuleDeploymentTx.data),
      value: '0',
    },
  ]

  const enableConnextModuleTransaction = enableModule(safeAddress, connextModuleExpectedAddress)
  connextModuleTransactions.push(enableConnextModuleTransaction)

  return connextModuleTransactions
}
