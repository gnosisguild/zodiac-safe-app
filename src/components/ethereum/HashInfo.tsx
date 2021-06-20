import { EthHashInfo } from "@gnosis.pm/safe-react-components";
import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    hashInfo: {
      "& p": {
        fontSize: 12,
        color: theme.palette.text.primary + " !important",
      },
      "& .sc-jNnpgg > p": {
        fontWeight: "bold",
        fontSize: 14,
      },
    },
  };
});

export const HashInfo = (props: Parameters<typeof EthHashInfo>[0]) => {
  const classes = useStyles();
  return <EthHashInfo className={classes.hashInfo} {...props} />;
};
