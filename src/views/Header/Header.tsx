import React from "react";
import { Row } from "../../components/layout/Row";
import { Grow } from "../../components/layout/Grow";
import { Badge, makeStyles, Typography } from "@material-ui/core";
import ZodiacAppLogo from "../../assets/images/zodiac-app-logo.png";
import classNames from "classnames";
import { ReactComponent as BagIcon } from "../../assets/icons/bag-icon.svg";
import { useRootDispatch, useRootSelector } from "../../store";
import { getTransactions } from "../../store/transactionBuilder/selectors";
import { openTransactionBuilder } from "../../store/transactionBuilder";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(1, 2, 1, 1),
    borderRadius: 60,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
  },
  header: {
    padding: theme.spacing(1, 2, 1, 1),
  },
  txBuilder: {
    padding: theme.spacing(1, 1, 1, 2),
  },
  img: {
    width: 36,
    height: 36,
  },
  title: {
    marginLeft: theme.spacing(1),
  },
  subtitle: {
    color: "rgb(201, 182, 133)",
    marginLeft: theme.spacing(3),
    fontSize: 12,
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

export const Header = () => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const transaction = useRootSelector(getTransactions);

  const handleOpen = () => dispatch(openTransactionBuilder());

  return (
    <Row className={classes.root}>
      <div className={classNames(classes.container, classes.header)}>
        <img
          src={ZodiacAppLogo}
          alt="Zodiac App Logo"
          className={classes.img}
        />
        <Typography variant="h5" className={classes.title}>
          Zodiac
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          Koan Of The Day
        </Typography>
      </div>
      <Grow />
      <div
        onClick={handleOpen}
        className={classNames(classes.container, classes.txBuilder)}
      >
        <Typography variant="h5">Transaction Builder</Typography>

        <Badge
          showZero
          badgeContent={transaction.length}
          color={transaction.length ? "error" : "primary"}
          classes={{ badge: classes.badge }}
        >
          <BagIcon className={classes.bagIcon} />
        </Badge>
      </div>
    </Row>
  );
};
