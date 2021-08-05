export enum ModuleType {
  DAO,
  DELAY,
  UNKNOWN,
}

export enum ModuleOperation {
  CREATE,
  REMOVE,
}

export interface Module {
  name?: string;
  address: string;
  type: ModuleType;
}

export interface ModuleMetadata {
  address: string;
  implAddress: string;
  type: ModuleType;
  name?: string;
  abi?: string | string[];
}

export interface StackableModule extends ModuleWithCooldown {
  subModules: Module[];
}

export interface ModuleWithCooldown extends Module {
  timeout: number;
  cooldown: number;
}

export interface DelayModule extends StackableModule {
  type: ModuleType.DELAY;
}

export interface DaoModule extends ModuleWithCooldown {
  type: ModuleType.DAO;
  executor: string;
  oracle: string;
  expiration: number;
  bond: string;
  templateId: string;
}

export interface ModulesState {
  operation: Operation;
  current?: Module;
  loadingModules: boolean;
  list: Module[];
  reloadCount: number;
  safeThreshold: number;
  pendingModules: PendingModule[];
  pendingRemoveModules: string[];
}

export type Operation = "read" | "write";

export interface DataDecoded {
  method: string;
  parameters: any[];
}

export interface MultiSendDataDecoded extends DataDecoded {
  method: "multiSend";
  parameters: {
    name: "transactions";
    type: "bytes";
    value: string;
    valueDecoded: {
      operation: number;
      to: string;
      value: string;
      data: string;
      dataDecoded: {
        method: string;
        parameters: {
          name: string;
          type: string;
          value: string;
        }[];
      };
    }[];
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

export interface SafeTransaction {
  safe: string;
  to: string;
  value: string;
  data: string;
  operation: 0 | 1;
  gasToken: string;
  nonce: number;
  dataDecoded: DataDecoded;
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
}
