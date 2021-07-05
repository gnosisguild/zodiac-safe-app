import React, { useState } from "react";
import { Row } from "../../layout/Row";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import { Icon } from "@gnosis.pm/safe-react-components";
import { AddTransactionBlock } from "./AddTransactionBlock";
import { FunctionFragment, Interface } from "@ethersproject/abi";
import { TransactionBlock } from "./TransactionBlock";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

interface TransactionBuilderProps {
  address: string;
  abi: string | string[];
}

const useStyles = makeStyles((theme) => ({
  queryButton: {
    padding: theme.spacing(1, 3),
    borderRadius: 10,
    textTransform: "none",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
    color: theme.palette.secondary.main + " !important",
    borderColor: theme.palette.secondary.main + " !important",
  },
  infoText: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    maxWidth: 350,
    fontSize: 12,
  },
  draggableClone: {},
}));

export interface Transaction {
  id: string;
  func: FunctionFragment;
  params: any[];
}

export const TransactionBuilder = ({
  abi,
  address,
}: TransactionBuilderProps) => {
  const classes = useStyles();
  const [overIndex, setOverIndex] = useState<number>();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      func: FunctionFragment.from(
        new Interface(["function A(string proposalId, bytes32[] txHashes)"])
          .fragments[0]
      ),
      params: [
        "Test String",
        ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      ],
    },
    {
      id: "2",
      func: FunctionFragment.from(
        new Interface(["function B(string proposalId, bytes32[] txHashes)"])
          .fragments[0]
      ),
      params: [
        "Test String",
        ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      ],
    },
    {
      id: "3",
      func: FunctionFragment.from(
        new Interface(["function C(string proposalId, bytes32[] txHashes)"])
          .fragments[0]
      ),
      params: [
        "Test String",
        ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      ],
    },
    {
      id: "4",
      func: FunctionFragment.from(
        new Interface(["function D(string proposalId, bytes32[] txHashes)"])
          .fragments[0]
      ),
      params: [
        "Test String",
        ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      ],
    },
    {
      id: "5",
      func: FunctionFragment.from(
        new Interface(["function E(string proposalId, bytes32[] txHashes)"])
          .fragments[0]
      ),
      params: [
        "Test String",
        ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      ],
    },
  ]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  return (
    <>
      <Row alignItems="center">
        <Typography variant="h4">Transaction Builder</Typography>

        <Box flexGrow={1} />

        <Button
          variant="contained"
          color="secondary"
          classes={{ disabled: classes.buttonDisabled }}
          className={classes.queryButton}
          startIcon={<Icon type="sent" size="md" color="white" />}
        >
          Submit Transactions
        </Button>
      </Row>
      <Typography variant="body1" className={classes.infoText}>
        Add transactions here, and we will bundle them together into a single
        transaction, to save you gas.
      </Typography>

      <DragDropContext
        onDragEnd={(result) => {
          setOverIndex(undefined);

          if (result.destination) {
            const sorted = Array.from(transactions);
            const [removed] = sorted.splice(result.source.index, 1);
            sorted.splice(result.destination.index, 0, removed);
            setTransactions(sorted);
          }
        }}
        onDragUpdate={(update, provided) => {
          if (
            update.destination &&
            update.destination.index !== update.source.index
          ) {
            setOverIndex(update.destination.index);
          } else {
            setOverIndex(undefined);
          }
        }}
      >
        <Droppable droppableId={address}>
          {(provider) => (
            <div ref={provider.innerRef} {...provider.droppableProps}>
              {transactions.map((transaction, index) => (
                <TransactionBlock
                  index={index}
                  isOver={index === overIndex}
                  key={transaction.id}
                  id={transaction.id}
                  func={transaction.func}
                  params={transaction.params}
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
