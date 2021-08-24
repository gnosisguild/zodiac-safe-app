import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddTransaction,
  SerializedTransaction,
  TransactionBuilderState,
} from "./models";

const initialModulesState: TransactionBuilderState = {
  open: false,
  addTransaction: {},
  transactions: [],
};

export const transactionBuilderSlice = createSlice({
  name: "transactionBuilder",
  initialState: initialModulesState,
  reducers: {
    setTransactionBuilderOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    setTransactions(state, action: PayloadAction<SerializedTransaction[]>) {
      state.transactions = action.payload;
    },
    addTransaction(state, action: PayloadAction<SerializedTransaction>) {
      state.transactions.push(action.payload);
    },
    resetTransactions(state) {
      state.transactions = [];
    },
    setNewTransaction(state, action: PayloadAction<AddTransaction>) {
      state.addTransaction = action.payload;
    },
    resetNewTransaction(state) {
      state.addTransaction = {};
    },
  },
});

export const {
  setTransactionBuilderOpen,
  setNewTransaction,
  resetNewTransaction,
  resetTransactions,
  addTransaction,
  setTransactions,
} = transactionBuilderSlice.actions;
