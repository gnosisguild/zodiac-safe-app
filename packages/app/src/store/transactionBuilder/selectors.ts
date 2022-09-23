import { RootState } from "../index";
import { deserializeTransaction } from "./helpers";

export function getAddTransaction(state: RootState) {
  return state.transactionBuilder.addTransaction;
}

export function getTransactions(state: RootState) {
  return state.transactionBuilder.transactions.map(deserializeTransaction);
}

export function getTransactionBuilderOpen(state: RootState) {
  return state.transactionBuilder.open;
}
