import React, { useCallback, useEffect, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../Collapsable";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import classNames from "classnames";
import { Icon } from "@gnosis.pm/safe-react-components";
import { useContractQuery } from "../../../hooks/useContractQuery";
import { ContractFunctionInput } from "./ContractFunctionInput";
import { ContractFunctionResult } from "./ContractFunctionResult";
import { ContractFunctionHeader } from "./ContractFunctionHeader";
import { isBasicFunction, isHashResult } from "../../../utils/contracts";

interface ContractFunctionBlockProps {
  address: string;
  abi: string | string[];
  func: FunctionFragment;
}

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  clickable: {
    cursor: "pointer",
  },
  grow: {
    flexGrow: 1,
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  expandIcon: {
    marginLeft: theme.spacing(2),
  },
  queryButton: {
    marginTop: theme.spacing(2),
  },
}));

export const ContractFunctionQueryBlock = ({
  address,
  abi,
  func,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<string[]>([]);
  const [lastQueryDate, setLastQueryDate] = useState<Date>();

  const { loading, result, fetch } = useContractQuery();

  const isHash = isHashResult(result);

  const execQuery = useCallback(() => {
    fetch(address, abi, func.name, data);
  }, [abi, address, data, fetch, func.name]);

  useEffect(() => {
    if (!loading && result) {
      setLastQueryDate(new Date());
    }
  }, [loading, result]);

  useEffect(() => {
    if (isBasicFunction(func)) {
      execQuery();
    }
  }, [execQuery, func]);

  const arrow = open ? (
    <ExpandLessIcon className={classes.expandIcon} />
  ) : (
    <ExpandMoreIcon className={classes.expandIcon} />
  );

  const content = (
    <>
      <ContractFunctionResult func={func} result={result} />
      <ContractFunctionInput func={func} onChange={setData} />
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        className={classes.queryButton}
        onClick={execQuery}
        startIcon={
          <Icon
            color="primary"
            size="md"
            type="sent"
            className={classes.icon}
          />
        }
      >
        RUN QUERY
      </Button>
    </>
  );

  return (
    <Collapsable open={open && !isHash} content={content}>
      <Box
        className={classNames(classes.row, { [classes.clickable]: !isHash })}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="h6">{func.name}</Typography>
        <div className={classes.grow} />
        <ContractFunctionHeader date={lastQueryDate} result={result} />
        {!isHash ? arrow : null}
      </Box>
    </Collapsable>
  );
};
