import React from "react";
import ReactDOM from "react-dom";
import { Badge, makeStyles } from "@material-ui/core";
import { TransactionBuilderTitle } from "./TransactionBuilderTitle";
import { Row } from "../../components/layout/Row";
import { ReactComponent as BagIcon } from "../../assets/icons/bag-icon.svg";
import { useRootDispatch, useRootSelector } from "../../store";
import { openTransactionBuilder } from "../../store/transactionBuilder";
import { getTransactions } from "../../store/transactionBuilder/selectors";

const rootElement = document.getElementById("root");

const useStyles = makeStyles((theme) => ({
  root: {
    right: 0,
    bottom: 0,
    position: "absolute",
    cursor: "pointer",
    padding: theme.spacing(1.5),
    borderTopLeftRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    alignItems: "center",
    zIndex: 1,
    boxShadow: "0px 0px 6px 1px rgb(40 54 61 / 39%)",
  },
  bagIcon: {
    marginLeft: theme.spacing(4),
    stroke: "white",
  },
  badge: {
    marginTop: 8,
    marginRight: 8,
    color: theme.palette.common.white,
  },
}));

export const TransactionBuilderTab = () => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const transaction = useRootSelector(getTransactions);

  const handleOpen = () => dispatch(openTransactionBuilder());

  const button = (
    <Row className={classes.root} onClick={handleOpen}>
      <TransactionBuilderTitle />
      <Badge
        showZero
        badgeContent={transaction.length}
        color={transaction.length ? "error" : "primary"}
        classes={{ badge: classes.badge }}
      >
        <BagIcon className={classes.bagIcon} />
      </Badge>
    </Row>
  );
  return ReactDOM.createPortal(button, rootElement as HTMLElement);
};
