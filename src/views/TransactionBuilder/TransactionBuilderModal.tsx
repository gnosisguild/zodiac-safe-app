import React, { HTMLProps } from "react";
import { Row } from "../../components/layout/Row";
import { Button, makeStyles, Modal, Paper } from "@material-ui/core";
import { Icon } from "@gnosis.pm/safe-react-components";
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
import { ReactComponent as ChevronDown } from "../../assets/icons/chevron-down.svg";
import { TransactionBuilderTitle } from "./TransactionBuilderTitle";
import { animated, useSpring } from "react-spring";
import { fetchPendingModules } from "../../store/modules";
import { TransactionBuilderList } from "./components/TransactionBuilderList";
import { TransactionBuilderEmptyList } from "./components/TransactionBuilderEmptyList";
import { Grow } from "../../components/layout/Grow";

const useStyles = makeStyles((theme) => ({
  fullWindow: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    outline: "none",
  },
  header: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1, 2),
    color: theme.palette.common.white,
    alignItems: "center",
  },
  queryButton: {
    padding: theme.spacing(1, 3),
    borderRadius: 10,
    boxShadow: "none",
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
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
}));

interface FadeProps extends HTMLProps<HTMLDivElement> {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

function getAppContainerDimensions(): { width: number; height: number } {
  const appContainer = document.querySelector(
    "#app-content"
  ) as HTMLElement | null;
  if (!appContainer)
    return { width: window.innerWidth, height: window.innerHeight };
  return { width: appContainer.offsetWidth, height: appContainer.offsetHeight };
}

const Slide = React.forwardRef<HTMLDivElement, FadeProps>((props, ref) => {
  const { in: open, children, onExited, onEnter, ...other } = props;

  const { width, height } = getAppContainerDimensions();
  const x = width - 300 + "px";
  const y = height + "px";

  const style = useSpring({
    from: { transform: `translate(${x}, ${y})`, opacity: 0 },
    to: {
      transform: open ? "translate(0px, 0px)" : `translate(${x}, ${y})`,
      opacity: open ? 1 : 0,
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
  const { sdk, safe } = useSafeAppsSDK();
  const dispatch = useRootDispatch();
  const { width } = getAppContainerDimensions();

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
      disablePortal
      keepMounted
      open={open}
      onClose={handleClose}
      className={classes.fullWindow}
      style={{ width, left: "auto" }}
      BackdropProps={{ open: false }}
    >
      <Slide in={open} className={classes.fullWindow}>
        <Paper className={classes.fullWindow} elevation={2}>
          <Row className={classes.header}>
            <TransactionBuilderTitle />

            <Grow />

            <Button
              onClick={handleClose}
              startIcon={<ChevronDown className={classes.downIcon} />}
              className={classes.minimizeButton}
            >
              Minimize
            </Button>
          </Row>

          <div className={classes.content}>
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
              className={classes.queryButton}
              startIcon={<Icon type="sent" size="md" color="white" />}
              onClick={handleSubmitTransaction}
            >
              Submit Transaction Bundle
            </ActionButton>
          </div>
        </Paper>
      </Slide>
    </Modal>
  );
};
