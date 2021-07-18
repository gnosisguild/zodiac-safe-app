import { FunctionFragment } from "@ethersproject/abi";

export interface TransactionBuilderState {
  addTransaction: AddTransaction;
}

export interface ModuleTransaction {
  id: string;
  func: FunctionFragment;
  params: any[];
}

export interface AddTransaction {
  func?: string;
  params?: any[];
}
