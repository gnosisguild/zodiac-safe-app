import React, { useCallback, useState } from "react";
import { Row } from "../../../components/layout/Row";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Icon } from "@gnosis.pm/safe-react-components";
import { AddTransactionBlock } from "./AddTransactionBlock";
import { FunctionFragment, Interface } from "@ethersproject/abi";
import { TransactionBlock } from "./TransactionBlock";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { ActionButton } from "../../../components/ActionButton";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { useRootSelector } from "../../../store";
import { getCurrentModule } from "../../../store/modules/selectors";

interface TransactionBuilderProps {
  address: string;
  abi: string | string[];
}

const useStyles = makeStyles((theme) => ({
  queryButton: {
    padding: theme.spacing(1, 3),
    borderRadius: 10,
    boxShadow: "none",
  },
  infoText: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    maxWidth: 350,
  },
}));

export interface ModuleTransaction {
  id: string;
  func: FunctionFragment;
  params: any[];
}

export const TransactionBuilder = ({
  abi,
  address,
}: TransactionBuilderProps) => {
  const classes = useStyles();
  const { sdk } = useSafeAppsSDK();
  const module = useRootSelector(getCurrentModule);

  const [overIndex, setOverIndex] = useState<number>();
  const [sourceIndex, setSourceIndex] = useState<number>();
  const [transactions, setTransactions] = useState<ModuleTransaction[]>([]);

  const handleAddTransaction = (transaction: ModuleTransaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleDragStart = (result: DragStart) => {
    setSourceIndex(result.source.index);
  };

  const handleDragUpdate = (update: DragUpdate) => {
    if (
      update.destination &&
      update.destination.index !== update.source.index
    ) {
      setOverIndex(update.destination.index);
    } else {
      setOverIndex(undefined);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    setOverIndex(undefined);
    setSourceIndex(undefined);
    if (result.destination) {
      const sorted = Array.from(transactions);
      const [removed] = sorted.splice(result.source.index, 1);
      sorted.splice(result.destination.index, 0, removed);
      setTransactions(sorted);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!module) return;
    try {
      const contractInterface = new Interface(abi);
      const txs = transactions.map((tx): Transaction => {
        return {
          value: "0",
          to: module.address,
          data: contractInterface.encodeFunctionData(tx.func, tx.params),
        };
      });
      await sdk.txs.send({ txs });
      setTransactions([]);
    } catch (error) {
      console.log("handleSubmitTransaction:error", error);
    }
  };

  const handleTransactionUpdate = useCallback(
    (id, params) => {
      const txs = transactions.map((transaction) => {
        if (transaction.id !== id) {
          return transaction;
        }
        return { ...transaction, params };
      });
      setTransactions(txs);
    },
    [transactions]
  );

  const handleTransactionDelete = useCallback(
    (id) => {
      const txs = Array.from(transactions);
      const index = txs.findIndex((tx) => tx.id === id);
      if (index >= 0) {
        txs.splice(index, 1);
        setTransactions(txs);
      }
    },
    [transactions]
  );

  return (
    <>
      <Row alignItems="center">
        <Typography variant="h4">Transaction Builder</Typography>

        <Box flexGrow={1} />

        <ActionButton
          variant="contained"
          color="secondary"
          disabled={!transactions.length}
          className={classes.queryButton}
          startIcon={<Icon type="sent" size="md" color="white" />}
          onClick={handleSubmitTransaction}
        >
          Submit Transactions
        </ActionButton>
      </Row>
      <Typography variant="body2" className={classes.infoText}>
        Add transactions here, and we will bundle them together into a single
        transaction, to save you gas.
      </Typography>

      <DragDropContext
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
      >
        <Droppable droppableId={address}>
          {(provider) => (
            <div ref={provider.innerRef} {...provider.droppableProps}>
              {transactions.map((transaction, index) => (
                <TransactionBlock
                  index={index}
                  id={transaction.id}
                  key={transaction.id}
                  func={transaction.func}
                  params={transaction.params}
                  isOver={index === overIndex}
                  isOverBefore={sourceIndex ? index < sourceIndex : false}
                  onUpdate={handleTransactionUpdate}
                  onDelete={handleTransactionDelete}
                />
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <AddTransactionBlock abi={abi} onAdd={handleAddTransaction} />
    </>
  );
};
