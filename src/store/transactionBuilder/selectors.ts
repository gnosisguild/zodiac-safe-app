import { RootState } from "../index";

export function getAddTransaction(state: RootState) {
  return state.transactionBuilder.addTransaction;
}
