import { ModuleTransaction, SerializedModuleTransaction } from "./models";
import { FunctionFragment, Interface } from "@ethersproject/abi";

export function serializeModuleTransaction(
  moduleTransaction: ModuleTransaction
): SerializedModuleTransaction {
  return {
    ...moduleTransaction,
    func: moduleTransaction.func.format("full"),
  };
}

export function deserializeModuleTransaction(
  moduleTransaction: SerializedModuleTransaction
): ModuleTransaction {
  const interf = new Interface([moduleTransaction.func]);
  return {
    ...moduleTransaction,
    func: FunctionFragment.from(interf.fragments[0]),
  };
}
