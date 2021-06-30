import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { makeStyles, Paper } from "@material-ui/core";
import { FunctionOutputs } from "../../../hooks/useContractQuery";

interface ContractFunctionErrorProps {
  error?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main,
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.error.main,
    borderStyle: "solid",
    borderWidth: 2,
  },
}));

export const ContractFunctionError = ({
  error,
}: ContractFunctionErrorProps) => {
  const classes = useStyles();
  if (!error) return null;
  return <div className={classes.root}>{error}</div>;
};
