import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { ContractReadFunctionsList } from "./ContractReadFunctionsList";
import { Transaction } from "../../../store/transactionBuilder/models";
import { setOperation } from "../../../store/modules";
import { useRootDispatch, useRootSelector } from "../../../store";
import classNames from "classnames";
import { ABI, Operation } from "../../../store/modules/models";
import { getOperation } from "../../../store/modules/selectors";
import { AddTransactionBlock } from "../transaction/AddTransactionBlock";
import { addTransaction } from "../../../store/transactionBuilder";
import { serializeTransaction } from "../../../store/transactionBuilder/helpers";
import { ContractOperationToggleButtons } from "../ContractOperationToggleButtons";

interface ContractInteractionsProps {
  address: string;
  abi: ABI;
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    background: "rgba(217, 212, 173, 0.1)",
    "&::before": {
      content: "none",
    },
  },
  hide: {
    display: "none",
  },
}));

export const ContractInteractions = ({
  address,
  abi,
}: ContractInteractionsProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const operation = useRootSelector(getOperation);

  const handleOperationChange = (operation?: Operation) => {
    if (operation) dispatch(setOperation(operation));
  };

  const handleAddTransaction = (transaction: Transaction) => {
    dispatch(addTransaction(serializeTransaction(transaction)));
  };

  return (
    <>
      <ContractOperationToggleButtons
        value={operation}
        onChange={(evt, value) => handleOperationChange(value)}
      />

      <Paper className={classes.content}>
        <div className={classNames({ [classes.hide]: operation !== "read" })}>
          <ContractReadFunctionsList address={address} abi={abi} />
        </div>
        <div className={classNames({ [classes.hide]: operation !== "write" })}>
          <AddTransactionBlock abi={abi} onAdd={handleAddTransaction} />
        </div>
      </Paper>
    </>
  );
};
