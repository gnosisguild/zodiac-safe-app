import { RootState } from "../index";
import { deserializeModuleTransaction } from "./helpers";

export function getAddTransaction(state: RootState) {
  return state.transactionBuilder.addTransaction;
}

export function getTransactions(state: RootState) {
  return state.transactionBuilder.transactions.map(
    deserializeModuleTransaction
  );
}

export function getTransactionBuilderOpen(state: RootState) {
  return state.transactionBuilder.open;
}
