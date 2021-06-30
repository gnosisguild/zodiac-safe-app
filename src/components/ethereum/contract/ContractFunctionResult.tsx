import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { makeStyles, Paper } from "@material-ui/core";
import { FunctionOutputs } from "../../../hooks/useContractQuery";

interface ContractFunctionResultProps {
  func: FunctionFragment;
  result?: FunctionOutputs;
}

const useStyles = makeStyles((theme) => ({
  resultContent: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.black,
    fontFamily: "Monaco",
    fontSize: 12,
    padding: theme.spacing(2),
  },
  resultHeader: {
    color: "rgba(0, 20, 40, 0.5)",
  },
}));

export const ContractFunctionResult = ({
  func,
  result,
}: ContractFunctionResultProps) => {
  const classes = useStyles();
  if (!result) return null;
  return (
    <Paper className={classes.resultContent} elevation={0}>
      {func.outputs?.map((param, index) => (
        <div>
          <span className={classes.resultHeader}>{param.type}: </span>
          <span>{result[index].toString()}</span>
        </div>
      ))}
    </Paper>
  );
};
