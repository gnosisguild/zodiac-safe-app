import React, { useCallback, useEffect, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../Collapsable";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import classNames from "classnames";
import { useContractQuery } from "../../../hooks/useContractQuery";
import { ContractQueryForm } from "./ContractQueryForm";
import { ContractFunctionResult } from "./ContractFunctionResult";
import { ContractFunctionHeader } from "./ContractFunctionHeader";
import {
  isBasicFunction,
  validateFunctionResultsAddress,
} from "../../../utils/contracts";
import { Row } from "../../layout/Row";
import { useModulesSelector } from "../../../contexts/modules";
import { ContractFunctionError } from "./ContractFunctionError";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play-icon.svg";
import { ActionButton } from "../../ActionButton";
import { ContractFunctionParamInput } from "./ContractFunctionParamInput";

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
  icon: {
    color: theme.palette.secondary.main,
  },
  queryButton: {
    marginTop: theme.spacing(2),
  },
}));

export const ContractFunctionQueryBlock = ({
  address,
  func,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();
  const reloadCount = useModulesSelector((state) => state.reloadCount);

  const [open, setOpen] = useState(false);
  const [lastQueryDate, setLastQueryDate] = useState<Date>();

  const { loading, result, fetch, error } = useContractQuery();

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
      <ContractFunctionError error={error} />
      <ContractFunctionResult loading={loading} func={func} result={result} />
      <ContractQueryForm func={func}>
        {({ paramInputProps, areParamsValid, getParams }) => (
          <>
            {paramInputProps.map((props, index) => (
              <Box marginTop={2}>
                {<ContractFunctionParamInput key={index} {...props} />}
              </Box>
            ))}
            {paramInputProps.length ? (
              <ActionButton
                fullWidth
                disabled={!areParamsValid}
                className={classes.queryButton}
                onClick={() => execQuery(getParams())}
                startIcon={<PlayIcon className={classes.icon} />}
              >
                Run Query
              </ActionButton>
            ) : null}
          </>
        )}
      </ContractQueryForm>
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
          loading={loading}
          date={lastQueryDate}
          address={shrink && result ? result[0].toString() : undefined}
        />
        {!shrink ? arrow : null}
      </Row>
    </Collapsable>
  );
};
