import React, { useCallback, useEffect, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../Collapsable";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import classNames from "classnames";
import { useContractQuery } from "../../../hooks/useContractQuery";
import { ContractFunctionQuery } from "./ContractFunctionQuery";
import { ContractFunctionResult } from "./ContractFunctionResult";
import { ContractFunctionHeader } from "./ContractFunctionHeader";
import {
  isBasicFunction,
  validateFunctionResultsAddress,
} from "../../../utils/contracts";
import { Row } from "../../layout/Row";
import { useModulesState } from "../../../contexts/modules";

interface ContractFunctionBlockProps {
  address: string;
  func: FunctionFragment;
}

const useStyles = makeStyles((theme) => ({
  clickable: {
    cursor: "pointer",
  },
  expandIcon: {
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

export const ContractFunctionQueryBlock = ({
  address,
  func,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();
  const { reloadCount } = useModulesState();
  const [open, setOpen] = useState(false);
  const [lastQueryDate, setLastQueryDate] = useState<Date>();

  const { loading, result, fetch } = useContractQuery();

  const isBasic = isBasicFunction(func);
  const resultsAddress = validateFunctionResultsAddress(func);

  const execQuery = useCallback(
    (params?: any[]) => {
      setLastQueryDate(undefined);
      fetch(address, [func], func.name, params);
    },
    [address, fetch, func]
  );

  useEffect(() => {
    if (!loading && result) {
      setLastQueryDate(new Date());
    }
  }, [loading, result]);

  useEffect(() => {
    if (isBasic) {
      execQuery();
    }
  }, [execQuery, isBasic, reloadCount]);

  const arrow = open ? (
    <ExpandLessIcon className={classes.expandIcon} />
  ) : (
    <ExpandMoreIcon className={classes.expandIcon} />
  );

  const content = (
    <>
      {loading ? (
        "loading..."
      ) : (
        <ContractFunctionResult func={func} result={result} />
      )}
      <ContractFunctionQuery func={func} onQuery={execQuery} />
    </>
  );

  const shrink = isBasic && resultsAddress;

  return (
    <Collapsable open={open && !shrink} content={content}>
      <Row
        alignItems="center"
        className={classNames({ [classes.clickable]: !shrink })}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="h6">{func.name}</Typography>
        <Box flexGrow={1} />
        <ContractFunctionHeader
          date={lastQueryDate}
          address={shrink && result ? result[0].toString() : undefined}
        />
        {!shrink ? arrow : null}
      </Row>
    </Collapsable>
  );
};
