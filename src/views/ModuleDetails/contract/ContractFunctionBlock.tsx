import React, { useCallback, useEffect, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Collapsable } from "../../../components/Collapsable";
import classNames from "classnames";
import { useContractQuery } from "../../../hooks/useContractQuery";
import { ContractQueryForm } from "../../../components/ethereum/ContractQueryForm";
import { ContractFunctionResult } from "./ContractFunctionResult";
import { ContractFunctionHeader } from "./ContractFunctionHeader";
import {
  isBasicFunction,
  validateFunctionResultsAddress,
} from "../../../utils/contracts";
import { Row } from "../../../components/layout/Row";
import { ContractFunctionError } from "./ContractFunctionError";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play-icon.svg";
import { ActionButton } from "../../../components/ActionButton";
import { ParamInput } from "../../../components/ethereum/ParamInput";
import { useRootSelector } from "../../../store";
import { getReloadCount } from "../../../store/modules/selectors";
import { ArrowIcon } from "../../../components/icons/ArrowIcon";

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
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  queryButton: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginRight: theme.spacing(1),
  },
}));

export const ContractFunctionQueryBlock = ({
  address,
  func,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();
  const reloadCount = useRootSelector(getReloadCount);

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

  const content = (
    <>
      <ContractFunctionError error={error} />
      <ContractFunctionResult loading={loading} func={func} result={result} />
      <ContractQueryForm func={func}>
        {({ paramInputProps, areParamsValid, getParams }) => (
          <>
            {paramInputProps.map((props, index) => (
              <Box marginTop={2} key={index}>
                <ParamInput {...props} />
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
        <Typography variant="h6" className={classes.title}>
          {func.name}
        </Typography>
        <Box flexGrow={1} />
        <ContractFunctionHeader
          loading={loading}
          date={lastQueryDate}
          address={shrink && result ? result[0].toString() : undefined}
        />
        {!shrink ? (
          <ArrowIcon up={open} className={classes.expandIcon} />
        ) : null}
      </Row>
    </Collapsable>
  );
};
