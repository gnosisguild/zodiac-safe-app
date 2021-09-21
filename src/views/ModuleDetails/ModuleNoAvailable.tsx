import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Link } from "../../components/text/Link";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { getNetworkExplorerInfo } from "../../utils/explorers";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2.5),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

export const ModuleNoAvailable = () => {
  const classes = useStyles();
  const { safe } = useSafeAppsSDK();
  const { verifyUrl } = getNetworkExplorerInfo(safe.chainId) || {};

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        No Read or Write functions available
      </Typography>
      <Typography>
        We couldn't find an ABI and didn't recognize the bytecode for this
        module’s contract.
      </Typography>
      <Link target="_blank" href={verifyUrl}>
        Verify this contract on Etherscan to fix this.
      </Link>
    </Paper>
  );
};
