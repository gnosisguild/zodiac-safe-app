import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useRootSelector } from "../../store";
import { getSafeThreshold } from "../../store/modules/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2.5),
    maxWidth: 500,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  text: {
    color: "rgba(0, 20, 40, 0.5)",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    margin: theme.spacing(0, 2, 0, 3),
    fontWeight: "bold",
  },
  icon: {
    marginLeft: "16px",
  },
}));

export const ModulePendingTransaction = () => {
  const classes = useStyles();
  const safeThreshold = useRootSelector(getSafeThreshold);
  const isInstantExecution = safeThreshold === 1;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Skeleton variant="circle" width={40} height={40} />
        <Typography className={classes.addressText}>Address:</Typography>
        <Skeleton variant="rect" width={380} height={20} />
      </div>

      {!isInstantExecution ? (
        <Paper className={classes.paper}>
          <Typography variant="h5" className={classes.title}>
            Waiting on module approval
          </Typography>
          <Typography className={classes.text}>
            Once this module transaction has been approved by the other signers,
            you will be able to read and write to it.
          </Typography>
        </Paper>
      ) : null}
    </div>
  );
};
