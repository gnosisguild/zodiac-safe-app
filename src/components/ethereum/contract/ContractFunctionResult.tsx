import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { makeStyles, Paper } from "@material-ui/core";
import { FunctionOutputs } from "../../../hooks/useContractQuery";

interface ContractFunctionResultProps {
  func: FunctionFragment;
  result?: FunctionOutputs;
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.black,
    fontFamily: "Monaco",
    fontSize: 12,
    padding: theme.spacing(2),
  },
  item: {
    "& + &": {
      marginTop: theme.spacing(1),
    },
  },
  label: {
    color: "rgba(0, 20, 40, 0.5)",
  },
  value: {
    overflowWrap: "break-word",
  },
}));

export const ContractFunctionResult = ({
  func,
  result,
}: ContractFunctionResultProps) => {
  const classes = useStyles();
  if (!result) return null;
  return (
    <Paper className={classes.root} elevation={0}>
      {func.outputs?.map((param, index) => (
        <div key={index} className={classes.item}>
          <span className={classes.label}>{param.type}: </span>
          <span className={classes.value}>{result[index].toString()}</span>
        </div>
      ))}
    </Paper>
  );
};
