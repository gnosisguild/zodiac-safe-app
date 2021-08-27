import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../../components/Collapsable";
import { ContractFunctionHeader } from "./ContractFunctionHeader";
import { isBasicFunction, isOneResult } from "../../../utils/contracts";
import { Row } from "../../../components/layout/Row";
import { ArrowIcon } from "../../../components/icons/ArrowIcon";
import { Grow } from "../../../components/layout/Grow";

interface ContractFunctionPreviewBlockProps {
  func: FunctionFragment;
}

const useStyles = makeStyles((theme) => ({
  root: {
    opacity: 0.5,
  },
  expandIcon: {
    marginLeft: theme.spacing(2),
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  title: {
    marginRight: theme.spacing(1),
  },
}));

function getPlaceholderValue(func: FunctionFragment): string {
  if (!isOneResult(func) || !func.outputs) return "";
  const { baseType } = func.outputs[0];

  if (baseType.includes("int")) return "0";
  if (baseType === "bool") return "true";
  return "0x0000000000000000000000000000000000000000";
}

export const ContractFunctionPreviewBlock = ({
  func,
}: ContractFunctionPreviewBlockProps) => {
  const classes = useStyles();

  const isBasic = isBasicFunction(func);
  const oneResult = isOneResult(func);

  const shrink = isBasic && oneResult;

  return (
    <Collapsable className={classes.root}>
      <Row alignItems="center">
        <Typography variant="h6" className={classes.title}>
          {func.name}
        </Typography>
        <Grow />
        <ContractFunctionHeader
          func={func}
          showResult={shrink}
          result={shrink ? [getPlaceholderValue(func)] : undefined}
        />
        {!shrink ? <ArrowIcon className={classes.expandIcon} /> : null}
      </Row>
    </Collapsable>
  );
};
