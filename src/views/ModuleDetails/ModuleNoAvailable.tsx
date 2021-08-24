import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Link } from "../../components/text/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2.5),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  text: {
    color: "rgba(0, 20, 40, 0.5)",
  },
}));

export const ModuleNoAvailable = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        No Read or Write functions available
      </Typography>
      <Typography className={classes.text}>
        We couldn’t find an ABI and didn’t recognize the bytecode for this
        module’s contract.
      </Typography>
      <Link
        className={classes.text}
        target="_blank"
        href="https://etherscan.io/verifyContract"
      >
        Verify this contract on Etherscan to fix this.
      </Link>
    </Paper>
  );
};
