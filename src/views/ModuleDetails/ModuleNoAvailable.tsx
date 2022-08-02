import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { ZodiacPaper } from "zodiac-ui-components";
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
  link: {
    fontSize: 16,
  }
}));

export const ModuleNoAvailable = () => {
  const classes = useStyles();
  const { safe } = useSafeAppsSDK();
  const { verifyUrl } = getNetworkExplorerInfo(safe.chainId) || {};

  return (
    <ZodiacPaper borderStyle="double" className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        No Read or Write functions available
      </Typography>
      <Typography>
        We couldn't find an ABI and didn't recognize the bytecode for this
        module’s contract.
      </Typography>
      <Link target="_blank" href={verifyUrl} className={classes.link}>
        Verify this contract on Etherscan to fix this.
      </Link>
    </ZodiacPaper>
  );
};
