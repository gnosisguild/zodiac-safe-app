import { KnownContracts } from '@gnosis-guild/zodiac'
import { Interface, InterfaceAbi } from 'ethers'
import { getModuleAbi } from 'abis'

export enum ModuleType {
  TELLOR = 'tellor',
  OPTIMISTIC_GOVERNOR = 'optimisticGovernor',
  REALITY_ETH = 'realityETH',
  REALITY_ERC20 = 'realityERC20',
  DELAY = 'delay',
  BRIDGE = 'bridge',
  EXIT = 'exit',
  ROLES_V1 = 'roles_v1',
  ROLES_V2 = 'roles_v2',
  OZ_GOVERNOR = 'ozGovernor',
  KLEROS_REALITY = 'klerosReality',
  CONNEXT = 'connext',
  UNKNOWN = 'unknown',
}

export enum ModuleVersion {
  tellor = '2.1.0',
  optimisticGovernor = '1.2.0',
  realityETH = '2.0.0',
  realityERC20 = '2.0.0',
  delay = '1.1.1',
  bridge = '1.0.0',
  exit = '1.2.0',
  roles_v1 = '1.1.0',
  roles_v2 = '2.1.1',
  ozGovernor = '1.0.0',
  klerosReality = '2.0.0',
  connext = '1.0.0',
}

export enum ZodiacHelperContractVersion {
  FACTORY = '1.2.0',
  CIRCULATING_SUPPLY = '1.2.0',
  VOTES_TOKEN = '1.0.0',
}

export const MODULE_NAMES: Record<ModuleType, string> = {
  [ModuleType.TELLOR]: 'Tellor Module',
  [ModuleType.OPTIMISTIC_GOVERNOR]: 'UMA oSnap Module',
  [ModuleType.REALITY_ERC20]: 'Reality Module',
  [ModuleType.REALITY_ETH]: 'Reality Module',
  [ModuleType.KLEROS_REALITY]: 'Kleros Reality Module',
  [ModuleType.UNKNOWN]: 'Unknown Module',
  [ModuleType.BRIDGE]: 'Bridge Module',
  [ModuleType.DELAY]: 'Delay Modifier',
  [ModuleType.ROLES_V1]: 'Roles Modifier (v1)',
  [ModuleType.ROLES_V2]: 'Roles Modifier (v2)',
  [ModuleType.EXIT]: 'Exit Module',
  [ModuleType.OZ_GOVERNOR]: 'Governor Module',
  [ModuleType.CONNEXT]: 'Connext Module',
}

export const MODULE_ABIS: Record<ModuleType, Interface | InterfaceAbi> = {
  [ModuleType.TELLOR]: getModuleAbi(
    KnownContracts.TELLOR,
    ModuleVersion[ModuleType.TELLOR],
  ) as InterfaceAbi,
  [ModuleType.OPTIMISTIC_GOVERNOR]: getModuleAbi(
    KnownContracts.OPTIMISTIC_GOVERNOR,
    ModuleVersion[ModuleType.OPTIMISTIC_GOVERNOR],
  ) as InterfaceAbi,
  [ModuleType.REALITY_ERC20]: getModuleAbi(
    KnownContracts.REALITY_ERC20,
    ModuleVersion[ModuleType.REALITY_ERC20],
  ) as InterfaceAbi,
  [ModuleType.REALITY_ETH]: getModuleAbi(
    KnownContracts.REALITY_ETH,
    ModuleVersion[ModuleType.REALITY_ETH],
  ) as InterfaceAbi,
  [ModuleType.KLEROS_REALITY]: getModuleAbi(
    KnownContracts.REALITY_ETH,
    ModuleVersion[ModuleType.KLEROS_REALITY],
  ) as InterfaceAbi,
  [ModuleType.UNKNOWN]: [],
  [ModuleType.BRIDGE]: getModuleAbi(
    KnownContracts.BRIDGE,
    ModuleVersion[ModuleType.BRIDGE],
  ) as InterfaceAbi,
  [ModuleType.DELAY]: getModuleAbi(
    KnownContracts.DELAY,
    ModuleVersion[ModuleType.DELAY],
  ) as InterfaceAbi,
  [ModuleType.ROLES_V1]: getModuleAbi(
    KnownContracts.ROLES,
    ModuleVersion[ModuleType.ROLES_V1],
  ) as InterfaceAbi,
  [ModuleType.ROLES_V2]: getModuleAbi(
    KnownContracts.ROLES,
    ModuleVersion[ModuleType.ROLES_V2],
  ) as InterfaceAbi,
  [ModuleType.EXIT]: getModuleAbi(
    KnownContracts.EXIT_ERC20,
    ModuleVersion[ModuleType.EXIT],
  ) as InterfaceAbi,
  [ModuleType.OZ_GOVERNOR]: getModuleAbi(
    KnownContracts.OZ_GOVERNOR,
    ModuleVersion[ModuleType.OZ_GOVERNOR],
  ) as InterfaceAbi,
  [ModuleType.CONNEXT]: getModuleAbi(
    KnownContracts.CONNEXT,
    ModuleVersion[ModuleType.CONNEXT],
  ) as InterfaceAbi,
}

export enum ModuleOperation {
  CREATE,
  REMOVE,
}

export interface Module {
  id: string
  name?: string
  address: string
  type: ModuleType
  subModules: Module[]
  owner?: string
  parentModule: string
}

export interface ModuleContract {
  address: string
  implAddress: string
  type: ModuleType
  name?: string
  abi?: Interface | InterfaceAbi
}

export interface ModuleContractMetadata {
  type: ModuleType
  name?: string
  abi: Interface | InterfaceAbi
}

export interface DelayModule extends Module {
  type: ModuleType.DELAY
  expiration: number
  cooldown: number
}

export interface TellorModule extends Module {
  type: ModuleType.TELLOR
  owner: string
  executor: string
  oracle: string
  expiration: number
  cooldown: number
}

export interface OptimisticGovernorModule extends Module {
  type: ModuleType.OPTIMISTIC_GOVERNOR
  finder: string
  owner: string
  collateral: string
  bond: string
  rules: string
  identifier: string
  liveness: string
}

export interface RealityModule extends Module {
  type: ModuleType.REALITY_ETH
  executor: string
  oracle: string
  expiration: number
  bond: string
  templateId: string
  cooldown: number
  arbitrator: string
}

export interface ConnextModule extends Module {
  type: ModuleType.CONNEXT
  domainId: string
  sender: string
  owner: string
  avatar: string
  target: string
  connext: string
}

export interface ModulesState {
  operation: Operation
  current?: Module
  currentPendingModule?: PendingModule
  loadingModules: boolean
  list: Module[]
  reloadCount: number
  safeThreshold: number
  pendingModules: PendingModule[]
  moduleAdded: boolean
  realityModuleScreen: boolean
  OzGovernorModuleScreen: boolean
}

export type Operation = 'read' | 'write'

export interface DataDecoded {
  method: string
  parameters: { name?: string; value?: string }[]
}

export interface MultiSendDataDecoded extends DataDecoded {
  method: 'multiSend'
  parameters: {
    name: 'transactions'
    type: 'bytes'
    value: string
    valueDecoded: DecodedTransaction[]
  }[]
}

export interface RawTransaction {
  to: string
  data: string
  value: string
  nonce: number
  operation: 0 | 1
}

export interface DecodedTransaction extends RawTransaction {
  dataDecoded: DataDecoded
}

export interface SafeTransaction extends DecodedTransaction {
  safe: string
  gasToken: string
}

export interface SafeStatusResponse {
  address: string
  nonce: number
  threshold: number
  owners: string[]
  masterCopy: string
  modules: string[]
  fallbackHandler: string
  guard: string
  version: string
}

export interface PendingModule {
  operation: ModuleOperation
  module: ModuleType
  address: string
  executor: string
}
