import React from "react";
import { IconButton, makeStyles, Paper } from "@material-ui/core";
import { ContractReadFunctionsList } from "./ContractReadFunctionsList";
import { Row } from "../../../components/layout/Row";
import { ReactComponent as ReloadIcon } from "../../../assets/icons/reload-icon.svg";
import { Transaction } from "../../../store/transactionBuilder/models";
import { increaseReloadCount, setOperation } from "../../../store/modules";
import { useRootDispatch, useRootSelector } from "../../../store";
import classNames from "classnames";
import { ABI, Operation } from "../../../store/modules/models";
import { getOperation } from "../../../store/modules/selectors";
import { AddTransactionBlock } from "../transaction/AddTransactionBlock";
import { addTransaction } from "../../../store/transactionBuilder";
import { serializeTransaction } from "../../../store/transactionBuilder/helpers";
import { ContractOperationToggleButtons } from "../ContractOperationToggleButtons";
import { Grow } from "../../../components/layout/Grow";

interface ContractInteractionsProps {
  address: string;
  abi: ABI;
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    background: "none",
    "&::before": {
      content: "none",
    }
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

  const handleReload = () => dispatch(increaseReloadCount());

  return (
    <>
      <Row style={{ alignItems: "end" }}>
        <ContractOperationToggleButtons
          value={operation}
          onChange={(evt, value) => handleOperationChange(value)}
        />

        <Grow />

        {operation === "read" ? (
          <IconButton onClick={handleReload}>
            <ReloadIcon />
          </IconButton>
        ) : null}
      </Row>

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
