import React from "react";
import {
  Badge,
  Fade,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import { Interface } from "@ethersproject/abi";
import { ActionButton } from "../../components/ActionButton";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Transaction } from "@gnosis.pm/safe-apps-sdk";
import { useRootDispatch, useRootSelector } from "../../store";
import {
  getTransactionBuilderOpen,
  getTransactions,
} from "../../store/transactionBuilder/selectors";
import {
  closeTransactionBuilder,
  resetTransactions,
} from "../../store/transactionBuilder";
import { fetchPendingModules } from "../../store/modules";
import { TransactionBuilderList } from "./components/TransactionBuilderList";
import { TransactionBuilderEmptyList } from "./components/TransactionBuilderEmptyList";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up-icon.svg";
import classNames from "classnames";
import { ReactComponent as BagIcon } from "../../assets/icons/bag-icon.svg";
import { Grow } from "../../components/layout/Grow";

const useStyles = makeStyles((theme) => ({
  fullWindow: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    outline: "none",
    borderRadius: "0",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(1, 2, 2, 2),
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    background: "rgba(78, 72, 87, 0.8)",

    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.2)",
  },
  modal: {
    width: "70%",
    minWidth: 400,
    maxWidth: 820,

    height: "calc(100% - 48px) !important",
    left: "auto !important",
    right: "25px !important",
    top: "25px !important",
  },
  backdrop: {
    backdropFilter: "blur(4px)",
    animationName: "$blur",
    animationDuration: "500ms",
    animationTimingFunction: "ease",
  },
  "@keyframes blur": {
    "0%": {
      backdropFilter: "blur(0px)",
    },
    "100%": {
      backdropFilter: "blur(4px)",
    },
  },
  bagIcon: {
    marginLeft: theme.spacing(2),
    stroke: "white",
  },
  badge: {
    marginTop: 8,
    marginRight: 8,
    color: theme.palette.common.white,
  },
}));

export const TransactionBuilder = () => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();
  const dispatch = useRootDispatch();

  const open = useRootSelector(getTransactionBuilderOpen);
  const transactions = useRootSelector(getTransactions);

  const handleClose = () => dispatch(closeTransactionBuilder());

  const handleSubmitTransaction = async () => {
    try {
      const txs = transactions.map((tx): Transaction => {
        const encoder = new Interface([tx.func]);
        return {
          to: tx.to,
          value: "0",
          data: encoder.encodeFunctionData(tx.func, tx.params),
        };
      });
      await sdk.txs.send({ txs });
      dispatch(resetTransactions());
      dispatch(
        fetchPendingModules({
          safeAddress: safe.safeAddress,
          chainId: safe.chainId,
        })
      );
      handleClose();
    } catch (error) {
      console.log("handleSubmitTransaction:error", error);
    }
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      className={classes.modal}
      BackdropProps={{
        className: classes.backdrop,
        invisible: true,
      }}
    >
      <Fade in={open}>
        <Paper
          className={classNames(classes.fullWindow, classes.content)}
          elevation={2}
        >
          <div className={classes.header}>
            <Typography variant="h5">Transaction Builder</Typography>
            <Grow />

            <Badge
              showZero
              badgeContent={transactions.length}
              color={transactions.length ? "error" : "primary"}
              classes={{ badge: classes.badge }}
            >
              <BagIcon className={classes.bagIcon} />
            </Badge>
          </div>

          {transactions.length ? (
            <TransactionBuilderList transactions={transactions} />
          ) : (
            <TransactionBuilderEmptyList />
          )}
          <ActionButton
            fullWidth
            variant="contained"
            color="secondary"
            disabled={!transactions.length}
            startIcon={<ArrowUpIcon />}
            onClick={handleSubmitTransaction}
          >
            Submit Transactions
          </ActionButton>
        </Paper>
      </Fade>
    </Modal>
  );
};
