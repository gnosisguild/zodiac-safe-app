export enum ModuleType {
  DAO,
  DELAY,
  UNKNOWN,
}

export interface Module {
  name: string;
  address: string;
  type: ModuleType;
}

export interface ModuleMetadata {
  address: string;
  implAddress: string;
  name: string;
  abi: string;
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
  pendingModules: ModuleType[];
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
