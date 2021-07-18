import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddTransaction, TransactionBuilderState } from "./models";

const initialModulesState: TransactionBuilderState = {
  addTransaction: {},
};

export const transactionBuilderSlice = createSlice({
  name: "modules",
  initialState: initialModulesState,
  reducers: {
    setAddTransaction(state, action: PayloadAction<AddTransaction>) {
      state.addTransaction = action.payload;
    },
    resetAddTransaction(state) {
      state.addTransaction = {};
    },
  },
});

export const { setAddTransaction, resetAddTransaction } =
  transactionBuilderSlice.actions;
