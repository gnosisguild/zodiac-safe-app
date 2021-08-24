import React from "react";
import { TransactionBuilderModal } from "./TransactionBuilderModal";
import { TransactionBuilderTab } from "./TransactionBuilderTab";

export const TransactionBuilder = () => {
  return (
    <>
      <TransactionBuilderTab />
      <TransactionBuilderModal />
    </>
  );
};
