import { FunctionFragment } from "@ethersproject/abi";
import { Module } from "../modules/models";

export interface TransactionBuilderState {
  open: boolean;
  addTransaction: AddTransaction;
  transactions: SerializedModuleTransaction[];
}

export interface ModuleTransaction {
  id: string;
  func: FunctionFragment;
  params: any[];
  module?: Module;
}

export interface SerializedModuleTransaction
  extends Omit<ModuleTransaction, "func"> {
  func: string;
}

export interface AddTransaction {
  func?: string;
  params?: any[];
}
