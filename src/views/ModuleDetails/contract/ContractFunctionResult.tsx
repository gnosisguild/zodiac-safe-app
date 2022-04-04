import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { makeStyles } from "@material-ui/core";
import { ZodiacPaper } from "zodiac-ui-components";
import { FunctionOutputs } from "../../../hooks/useContractQuery";
import { Skeleton } from "@material-ui/lab";
import { formatValue } from "../../../utils/contracts";

interface ContractFunctionResultProps {
  func: FunctionFragment;
  loading?: boolean;
  result?: FunctionOutputs;
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    fontFamily: "Roboto Mono",
    fontSize: 12,
    padding: theme.spacing(2),
  },
  item: {
    "& + &": {
      marginTop: theme.spacing(1),
    },
  },
  label: {
    color: "rgba(217, 212, 173, 0.9)",
  },
  value: {
    overflowWrap: "break-word",
  },
}));

export const ContractFunctionResult = ({
  func,
  loading = false,
  result,
}: ContractFunctionResultProps) => {
  const classes = useStyles();
  if (loading) return <Skeleton variant="rect" height={50} />;
  if (!result) return null;
  return (
    <ZodiacPaper borderStyle="single" className={classes.root}>
      {func.outputs?.map((param, index) => (
        <div key={index} className={classes.item}>
          <span className={classes.label}>
            {param.name ? `${param.name} (${param.type})` : param.type}:{" "}
          </span>
          <span className={classes.value}>
            {formatValue(param.baseType, result[index])}
          </span>
        </div>
      ))}
    </ZodiacPaper>
  );
};
