import React from "react";
import {
  Badge,
  Fade,
  makeStyles,
  Modal,
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
import { colors, ZodiacPaper } from "zodiac-ui-components";

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
  },
  content: {
    padding: theme.spacing(1.5, 1.5, 1.5, 1.5),
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    background: "rgba(78, 72, 87, 0.8)",
    borderWidth: 1,
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
    borderColor: colors.tan[300],
    padding: theme.spacing(0.5),
  },
  circleIconContainer: {
    borderColor: colors.tan[300],
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
      }}
    >
      <Fade in={open}>
        <ZodiacPaper
          borderStyle="double"
          className={classNames(classes.fullWindow, classes.content)}
          elevation={2}
        >
          <ZodiacPaper rounded="right" className={classes.header}>
            <Typography variant="h5">Bundle Transactions</Typography>
            <Grow />

            <ZodiacPaper 
              rounded="full"
              variant="outlined"
              className={classes.circleIconContainer}
            >
              <Badge
                showZero
                badgeContent={transactions.length}
                color={transactions.length ? "error" : "primary"}
                classes={{ badge: classes.badge, root: classes.badgeRoot }}
              />
            </ZodiacPaper>
          </ZodiacPaper>

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
        </ZodiacPaper>
      </Fade>
    </Modal>
  );
};
