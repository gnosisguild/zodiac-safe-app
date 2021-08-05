import { Transaction, SerializedTransaction } from "./models";
import { FunctionFragment, Interface } from "@ethersproject/abi";

export function serializeTransaction(
  moduleTransaction: Transaction
): SerializedTransaction {
  return {
    ...moduleTransaction,
    func: moduleTransaction.func.format("full"),
  };
}

export function deserializeTransaction(
  moduleTransaction: SerializedTransaction
): Transaction {
  const interf = new Interface([moduleTransaction.func]);
  return {
    ...moduleTransaction,
    func: FunctionFragment.from(interf.fragments[0]),
  };
}
