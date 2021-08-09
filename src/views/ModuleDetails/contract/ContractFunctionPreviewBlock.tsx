import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../../components/Collapsable";
import { ContractFunctionHeader } from "./ContractFunctionHeader";
import {
  isBasicFunction,
  validateFunctionReturnsHex,
} from "../../../utils/contracts";
import { Row } from "../../../components/layout/Row";
import { ArrowIcon } from "../../../components/icons/ArrowIcon";

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

export const ContractFunctionPreviewBlock = ({
  func,
}: ContractFunctionPreviewBlockProps) => {
  const classes = useStyles();

  const isBasic = isBasicFunction(func);
  const isHexReturned = validateFunctionReturnsHex(func);

  const shrink = isBasic && isHexReturned;

  return (
    <Collapsable className={classes.root}>
      <Row alignItems="center">
        <Typography variant="h6" className={classes.title}>
          {func.name}
        </Typography>
        <Box flexGrow={1} />
        <ContractFunctionHeader
          address={
            shrink ? "0x0000000000000000000000000000000000000000" : undefined
          }
        />
        {!shrink ? <ArrowIcon className={classes.expandIcon} /> : null}
      </Row>
    </Collapsable>
  );
};
