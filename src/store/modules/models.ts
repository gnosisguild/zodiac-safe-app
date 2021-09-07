import { Fragment } from "@ethersproject/abi";
import { KnownModules } from "@zodiacdao/zodiac";

export type ABI = string | string[] | Fragment[];

export enum ModuleType {
  REALITY_ETH = "realityETH",
  REALITY_ERC20 = "realityERC20",
  DELAY = "delay",
  AMB = "amb",
  EXIT = "exit",
  UNKNOWN = "unknown",
}

export const MODULE_TYPES: Record<keyof KnownModules, ModuleType> = {
  realityETH: ModuleType.REALITY_ETH,
  realityERC20: ModuleType.REALITY_ERC20,
  delay: ModuleType.DELAY,
  amb: ModuleType.AMB,
  exit: ModuleType.EXIT,
  scopeGuard: ModuleType.UNKNOWN,
};

export enum ModuleOperation {
  CREATE,
  REMOVE,
}

export interface Module {
  id: string;
  name?: string;
  address: string;
  type: ModuleType;
  subModules: Module[];
  owner?: string;
  parentModule: string;
}

export interface ModuleMetadata {
  address: string;
  implAddress: string;
  type: ModuleType;
  name?: string;
  abi?: ABI;
  bytecode?: string;
}

export interface DelayModule extends Module {
  type: ModuleType.DELAY;
  expiration: number;
  cooldown: number;
}

export interface RealityModule extends Module {
  type: ModuleType.REALITY_ETH;
  executor: string;
  oracle: string;
  expiration: number;
  bond: string;
  templateId: string;
  cooldown: number;
}

export interface ModulesState {
  operation: Operation;
  current?: Module;
  currentPendingModule?: PendingModule;
  loadingModules: boolean;
  list: Module[];
  reloadCount: number;
  safeThreshold: number;
  pendingModules: PendingModule[];
  moduleAdded: boolean;
}

export type Operation = "read" | "write";

export interface DataDecoded {
  method: string;
  parameters: { name?: string; value?: string }[];
}

export interface MultiSendDataDecoded extends DataDecoded {
  method: "multiSend";
  parameters: {
    name: "transactions";
    type: "bytes";
    value: string;
    valueDecoded: DecodedTransaction[];
  }[];
}

export interface DisableModuleDataDecoded extends DataDecoded {
  method: "disableModule";
  parameters: {
    name: string;
    type: "address";
    value: string;
  }[];
}

export interface RawTransaction {
  to: string;
  data: string;
  value: string;
  nonce: number;
  operation: 0 | 1;
}

export interface DecodedTransaction extends RawTransaction {
  dataDecoded: DataDecoded;
}

export interface SafeTransaction extends DecodedTransaction {
  safe: string;
  gasToken: string;
}

export interface SafeInfo {
  address: string;
  nonce: number;
  threshold: number;
  owners: string[];
  masterCopy: string;
  modules: string[];
  fallbackHandler: string;
  guard: string;
  version: string;
}

export interface PendingModule {
  operation: ModuleOperation;
  module: ModuleType;
  address: string;
  executor: string;
}
