import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useRootSelector } from "../../store";
import {
  getCurrentPendingModule,
  getSafeThreshold,
} from "../../store/modules/selectors";
import { ContractInteractionsPreview } from "./contract/ContractInteractionsPreview";
import { getModuleContractMetadata } from "../../utils/modulesValidation";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
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
    marginBottom: theme.spacing(3),
  },
  addressText: {
    margin: theme.spacing(0, 2, 0, 3),
    fontWeight: "bold",
  },
  icon: {
    marginLeft: "16px",
  },
  buttons: {
    marginTop: theme.spacing(3),
    opacity: 0.5,
  },
}));

function ModulePendingInstantTx() {
  const currentPendingTx = useRootSelector(getCurrentPendingModule);

  if (!currentPendingTx) return null;

  const metadata = getModuleContractMetadata(currentPendingTx.module);

  if (!metadata || !metadata.abi) return null;

  return (
    <ContractInteractionsPreview
      address={currentPendingTx.address}
      abi={metadata.abi}
    />
  );
}

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
      ) : (
        <ModulePendingInstantTx />
      )}
    </div>
  );
};
