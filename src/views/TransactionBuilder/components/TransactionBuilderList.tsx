import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { TransactionBlock } from "./TransactionBlock";
import { serializeTransaction } from "../../../store/transactionBuilder/helpers";
import { setTransactions } from "../../../store/transactionBuilder";
import { useRootDispatch } from "../../../store";
import { Transaction } from "../../../store/transactionBuilder/models";

interface TransactionBuilderListProps {
  transactions: Transaction[];
}

export const TransactionBuilderList = ({
  transactions,
}: TransactionBuilderListProps) => {
  const dispatch = useRootDispatch();

  const [overIndex, setOverIndex] = useState<number>();
  const [sourceIndex, setSourceIndex] = useState<number>();

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
      const sorted = Array.from(transactions).map(serializeTransaction);
      const [removed] = sorted.splice(result.source.index, 1);
      sorted.splice(result.destination.index, 0, removed);
      dispatch(setTransactions(sorted));
    }
  };

  const handleTransactionUpdate = useCallback(
    (id, params) => {
      const txs = transactions.map(serializeTransaction).map((transaction) => {
        if (transaction.id !== id) {
          return transaction;
        }
        return { ...transaction, params };
      });
      dispatch(setTransactions(txs));
    },
    [dispatch, transactions]
  );

  const handleTransactionDelete = useCallback(
    (id) => {
      const txs = Array.from(transactions).map(serializeTransaction);
      const index = txs.findIndex((tx) => tx.id === id);
      if (index >= 0) {
        txs.splice(index, 1);
        dispatch(setTransactions(txs));
      }
    },
    [dispatch, transactions]
  );

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <Droppable droppableId="transactions">
        {(provider) => (
          <div ref={provider.innerRef} {...provider.droppableProps}>
            {transactions.map((transaction, index) => (
              <TransactionBlock
                index={index}
                key={transaction.id}
                transaction={transaction}
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
  );
};
