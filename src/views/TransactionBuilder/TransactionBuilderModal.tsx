import React, { HTMLProps, useCallback, useState } from "react";
import { Row } from "../../components/layout/Row";
import { Box, Button, makeStyles, Modal, Paper } from "@material-ui/core";
import { Icon } from "@gnosis.pm/safe-react-components";
import { Interface } from "@ethersproject/abi";
import { TransactionBlock } from "./components/TransactionBlock";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { ActionButton } from "../../components/ActionButton";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { useRootDispatch, useRootSelector } from "../../store";
import { getCurrentModule } from "../../store/modules/selectors";
import {
  getTransactionBuilderOpen,
  getTransactions,
} from "../../store/transactionBuilder/selectors";
import {
  resetTransactions,
  setTransactionBuilderOpen,
  setTransactions,
} from "../../store/transactionBuilder";
import { ReactComponent as ChevronDown } from "../../assets/icons/chevron-down.svg";
import { TransactionBuilderTitle } from "./TransactionBuilderTitle";
import { useSpring, animated } from "react-spring";
import { serializeModuleTransaction } from "../../store/transactionBuilder/helpers";

const useStyles = makeStyles((theme) => ({
  fullWindow: {
    outline: "none",
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    color: theme.palette.common.white,
  },
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
  minimizeButton: {
    fontSize: 24,
    textTransform: "none",
    padding: theme.spacing(0, 2),
    color: theme.palette.common.white,
  },
  downIcon: {
    fill: theme.palette.common.white,
  },
  content: {
    padding: theme.spacing(3, 2, 2, 2),
  },
}));

interface FadeProps extends HTMLProps<HTMLDivElement> {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const Slide = React.forwardRef<HTMLDivElement, FadeProps>((props, ref) => {
  const { in: open, children, onExited, onEnter, ...other } = props;
  const x = window.innerWidth - 300 + "px";
  const y = window.innerHeight + "px";
  const style = useSpring({
    from: { transform: `translate(${x}, ${y})` },
    to: {
      transform: open ? "translate(0px, 0px)" : `translate(${x}, ${y})`,
    },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });
  return (
    <animated.div {...other} ref={ref} style={style}>
      {children}
    </animated.div>
  );
});

export const TransactionBuilderModal = () => {
  const classes = useStyles();
  const { sdk } = useSafeAppsSDK();
  const dispatch = useRootDispatch();

  const open = useRootSelector(getTransactionBuilderOpen);
  const module = useRootSelector(getCurrentModule);
  const transactions = useRootSelector(getTransactions);

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

  const handleClose = () => dispatch(setTransactionBuilderOpen(false));

  const handleDragEnd = (result: DropResult) => {
    setOverIndex(undefined);
    setSourceIndex(undefined);
    if (result.destination) {
      const sorted = Array.from(transactions).map(serializeModuleTransaction);
      const [removed] = sorted.splice(result.source.index, 1);
      sorted.splice(result.destination.index, 0, removed);
      dispatch(setTransactions(sorted));
    }
  };

  const handleSubmitTransaction = async () => {
    if (!module) return;
    try {
      const txs = transactions.map((tx): Transaction => {
        const encoder = new Interface([tx.func]);
        return {
          value: "0",
          to: module.address,
          data: encoder.encodeFunctionData(tx.func, tx.params),
        };
      });
      await sdk.txs.send({ txs });
      dispatch(resetTransactions());
    } catch (error) {
      console.log("handleSubmitTransaction:error", error);
    }
  };

  const handleTransactionUpdate = useCallback(
    (id, params) => {
      const txs = transactions
        .map(serializeModuleTransaction)
        .map((transaction) => {
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
      const txs = Array.from(transactions).map(serializeModuleTransaction);
      const index = txs.findIndex((tx) => tx.id === id);
      if (index >= 0) {
        txs.splice(index, 1);
        dispatch(setTransactions(txs));
      }
    },
    [dispatch, transactions]
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={classes.fullWindow}
      BackdropProps={{ invisible: true }}
    >
      <Slide in={open} className={classes.fullWindow}>
        <Paper className={classes.fullWindow} elevation={2}>
          <Row alignItems="center" className={classes.header}>
            <TransactionBuilderTitle />

            <Box flexGrow={1} />

            <Button
              onClick={handleClose}
              startIcon={<ChevronDown className={classes.downIcon} />}
              className={classes.minimizeButton}
            >
              Minimize
            </Button>
          </Row>

          <div className={classes.content}>
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

            <ActionButton
              fullWidth
              variant="contained"
              color="secondary"
              disabled={!transactions.length}
              className={classes.queryButton}
              startIcon={<Icon type="sent" size="md" color="white" />}
              onClick={handleSubmitTransaction}
            >
              Submit Transactions
            </ActionButton>
          </div>
        </Paper>
      </Slide>
    </Modal>
  );
};
