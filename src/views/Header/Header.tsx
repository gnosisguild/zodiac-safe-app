import React from "react";
import { Row } from "../../components/layout/Row";
import { Badge, makeStyles, Typography } from "@material-ui/core";
import { BadgeIcon, colors, doubleBorder, ZodiacPaper } from "zodiac-ui-components";
import classNames from "classnames";
import { useRootDispatch, useRootSelector } from "../../store";
import { getTransactions } from "../../store/transactionBuilder/selectors";
import { openTransactionBuilder } from "../../store/transactionBuilder";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  container: {
    "&.MuiPaper-root": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "&::before": doubleBorder(-5, colors.tan[300])
    },
  },
  header: {
    "&.MuiPaper-root": {
      padding: theme.spacing(0.5, 2, 0.5, 0.5),
      "&::before": doubleBorder(-5, colors.tan[300])
    },
  },
  txBuilder: {
    "&.MuiPaper-root": {
      padding: theme.spacing(0.5, 0.5, 0.5, 2),
      cursor: "pointer",
      transition: "0.2s ease all",
      "&::before": doubleBorder(-5, colors.tan[300]),
      "&:hover": {
        background: "rgba(217, 212, 173, 0.15)",
      },
    },
  },
  img: {
    display: "block",
    width: 36,
    height: 36,
  },
  title: {
    marginLeft: theme.spacing(1),
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
    border: `1px solid ${colors.tan[300]}`,
    padding: theme.spacing(0.5),
  },
  txBuilderTitle: {
    marginRight: theme.spacing(3),
  },
  circleIconContainer: {
    padding: theme.spacing(0.5),
  },
  banner: {
    "&.MuiPaper-root": {
      flexGrow: 1,
      position: "relative",
      borderWidth: 1,
      borderColor: colors.tan[300],
      backgroundColor: colors.tan[100],
      margin: theme.spacing(0, 2),
      "&::before": doubleBorder(-5, colors.tan[300])
    }
  },
}));

export const Header = () => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const transaction = useRootSelector(getTransactions);

  const handleOpen = () => dispatch(openTransactionBuilder());

  return (
    <Row className={classes.root}>
      <ZodiacPaper
        elevation={0}
        borderStyle="double"
        rounded="left"
        variant="elevation"
        className={classNames(
          classes.container,
          classes.header,
        )}
      >
        <BadgeIcon icon="zodiac"/>
        <Typography variant="h5" className={classes.title}>
          Zodiac
        </Typography>
      </ZodiacPaper>
      <ZodiacPaper elevation={0} className={classes.banner} />
      <ZodiacPaper
        borderStyle="double"
        onClick={handleOpen}
        elevation={0}
        rounded="right"
        className={classNames(
          classes.container,
          classes.txBuilder,
        )}
      >
        <Typography className={classes.txBuilderTitle}>
          Bundle Transactions
        </Typography>
        <ZodiacPaper
          rounded="full"
          variant="outlined"
          className={classes.circleIconContainer}
        >
          <Badge
            showZero
            badgeContent={transaction.length}
            color={transaction.length ? "error" : "primary"}
            classes={{ badge: classes.badge, root: classes.badgeRoot }}
          />
        </ZodiacPaper>
      </ZodiacPaper>
    </Row>
  );
};
