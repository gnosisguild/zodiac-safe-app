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
import { Grow } from "../../components/layout/Grow";

const useStyles = makeStyles((theme) => ({
  fullWindow: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    outline: "none",
    borderRadius: 0,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0.5, 0.5, 0.5, 1.5),
    border: "1px solid rgba(217, 212, 173, 0.3)",
    borderRadius: "0 60px 60px 0",
    background: "rgba(217, 212, 173, 0.1)",
  },
  content: {
    padding: theme.spacing(1.5, 1.5, 1.5, 1.5),
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

    height: "calc(100% - 22px) !important",
    left: "auto !important",
    right: "19px !important",
    top: "11px !important",
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
    color: theme.palette.common.white,
    display: "flex",
    position: "relative",
    transform: "none",
    textAlign: "center",
    background: "none",
    fontSize: 16,
  },
  badgeRoot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    width: 36,
    borderRadius: 60,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(217, 212, 173, 0.3)",
    padding: theme.spacing(0.5),
  },
  circleIconContainer: {
    borderRadius: 60,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(217, 212, 173, 0.3)",
    padding: theme.spacing(0.5),
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

            <div className={classes.circleIconContainer}>
              <Badge
                showZero
                badgeContent={transactions.length}
                color={transactions.length ? "error" : "primary"}
                classes={{ badge: classes.badge, root: classes.badgeRoot }}
              />
            </div>
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
