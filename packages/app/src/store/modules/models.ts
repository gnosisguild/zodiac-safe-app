import { ContractInterface } from "@ethersproject/contracts"

export enum ModuleType {
  TELLOR = "tellor",
  OPTIMISTIC_GOVERNOR = "optimisticGovernor",
  REALITY_ETH = "realityETH",
  REALITY_ERC20 = "realityERC20",
  DELAY = "delay",
  BRIDGE = "bridge",
  EXIT = "exit",
  ROLES = "roles",
  OZ_GOVERNOR = "ozGovernor",
  KLEROS_REALITY = "klerosReality",
  CONNEXT = "connext",
  UNKNOWN = "unknown",
}

export const MODULE_NAMES: Record<ModuleType, string> = {
  [ModuleType.TELLOR]: "Tellor Module",
  [ModuleType.OPTIMISTIC_GOVERNOR]: "UMA oSnap Module",
  [ModuleType.REALITY_ERC20]: "Reality Module",
  [ModuleType.REALITY_ETH]: "Reality Module",
  [ModuleType.KLEROS_REALITY]: "Kleros Reality Module",
  [ModuleType.UNKNOWN]: "Unknown Module",
  [ModuleType.BRIDGE]: "Bridge Module",
  [ModuleType.DELAY]: "Delay Modifier",
  [ModuleType.ROLES]: "Roles Modifier",
  [ModuleType.EXIT]: "Exit Module",
  [ModuleType.OZ_GOVERNOR]: "Governor Module",
  [ModuleType.CONNEXT]: "Connext Module",
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
  abi?: ContractInterface
  bytecode?: string
}

export interface ModuleContractMetadata {
  type: ModuleType
  abi: ContractInterface
  bytecode: string
}

export interface DelayModule extends Module {
  type: ModuleType.DELAY
  expiration: number
  cooldown: number
}

export interface TellorModule extends Module {
  type: ModuleType.TELLOR
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

export type Operation = "read" | "write"

export interface DataDecoded {
  method: string
  parameters: { name?: string; value?: string }[]
}

export interface MultiSendDataDecoded extends DataDecoded {
  method: "multiSend"
  parameters: {
    name: "transactions"
    type: "bytes"
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
