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
import { relative } from "path";

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
    borderColor: "rgba(217, 212, 173, 0.3)",
    background: "rgba(217, 212, 173, 0.1)",
  },
  leftHeader: {
    borderRadius: "60px 0 0 60px"
  },
  rightHeader: {
    borderRadius: "0 60px 60px 0"
  },
  header: {
    padding: theme.spacing(0.5, 2, 0.5, 0.5),
    position: "relative",
    "&::before": {
      content: '" "',
      position: "absolute",
      zIndex: 1,
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      borderRadius: "60px 0 0 60px",
      border: "1px solid rgba(217, 212, 173, 0.3)",
    },
  },
  txBuilder: {
    padding: theme.spacing(0.5, 0.5, 0.5, 2),
    position: "relative",
    cursor: "pointer",
    "&::before": {
      content: '" "',
      position: "absolute",
      zIndex: 1,
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      borderRadius: "0 60px 60px 0",
      border: "1px solid rgba(217, 212, 173, 0.3)",
    }
  },
  img: {
    display: "block",
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
  txBuilderTitle: {
    marginRight: theme.spacing(3),
  },
  circleIconContainer: {
    borderRadius: 60,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(217, 212, 173, 0.3)",
    padding: theme.spacing(0.5),
  },
  banner: {
    flexGrow: 1,
    position: "relative",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(217, 212, 173, 0.3)",
    background: "rgba(217, 212, 173, 0.1)",
    margin: theme.spacing(0,2),
    "&::before": {
      content: '" "',
      position: "absolute",
      zIndex: 1,
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      border: "1px solid rgba(217, 212, 173, 0.3)",
    },
  },
}));

export const Header = () => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const transaction = useRootSelector(getTransactions);

  const handleOpen = () => dispatch(openTransactionBuilder());

  return (
    <Row className={classes.root}>
      <div className={classNames(classes.container, classes.header, classes.leftHeader)}>
        <div className={classes.circleIconContainer}>
          <img
            src={ZodiacAppLogo}
            alt="Zodiac App Logo"
            className={classes.img}
          />
        </div>
        <Typography variant="h5" className={classes.title}>
          Zodiac
        </Typography>
      </div>
      <div className={classes.banner} />
      <div
        onClick={handleOpen}
        className={classNames(classes.container, classes.txBuilder, classes.rightHeader)}
      >
        <Typography className={classes.txBuilderTitle}>Transaction Builder</Typography>
        <div className={classes.circleIconContainer}>
          <Badge
            showZero
            badgeContent={transaction.length}
            color={transaction.length ? "error" : "primary"}
            classes={{ badge: classes.badge, root: classes.badgeRoot }}
          >
          </Badge>
        </div>
      </div>
    </Row>
  );
};
