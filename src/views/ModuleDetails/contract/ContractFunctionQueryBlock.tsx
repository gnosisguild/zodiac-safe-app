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
  formatValue,
  isBasicFunction,
  isOneResult,
} from "../../../utils/contracts";
import { Row } from "../../../components/layout/Row";
import { ContractFunctionError } from "./ContractFunctionError";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play-icon.svg";
import { ActionButton } from "../../../components/ActionButton";
import { ParamInput } from "../../../components/ethereum/ParamInput";
import { useRootSelector } from "../../../store";
import { getReloadCount } from "../../../store/modules/selectors";
import { ArrowIcon } from "../../../components/icons/ArrowIcon";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Grow } from "../../../components/layout/Grow";

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
  const { safe } = useSafeAppsSDK();

  const [open, setOpen] = useState(false);
  const [lastQueryDate, setLastQueryDate] = useState<Date>();

  const { loading, result, fetch, error } = useContractQuery();

  const isBasic = isBasicFunction(func);
  const oneResult = isOneResult(func);

  const baseType = oneResult && func.outputs ? func.outputs[0].baseType : "";
  const resultLength =
    result === undefined || !oneResult
      ? 0
      : formatValue(baseType, result[0]).length;

  const execQuery = useCallback(
    (params?: any[]) => {
      setLastQueryDate(undefined);
      fetch(safe.chainId, address, [func], func.name, params);
    },
    [address, fetch, func, safe.chainId]
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

  const maxResultLength = 60;
  const showResultOnHeader =
    oneResult && resultLength < maxResultLength && !error;
  const collapsable = !showResultOnHeader || !isBasic;

  const content = (
    <>
      <ContractFunctionError error={error} />
      {!showResultOnHeader ? (
        <ContractFunctionResult loading={loading} func={func} result={result} />
      ) : null}
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

  return (
    <Collapsable open={open && collapsable} content={content}>
      <Row
        style={{ alignItems: "center" }}
        className={classNames({ [classes.clickable]: collapsable })}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="h6" className={classes.title}>
          {func.name}
        </Typography>
        <Grow />
        <ContractFunctionHeader
          func={func}
          result={result}
          loading={loading}
          date={lastQueryDate}
          showResult={showResultOnHeader}
        />
        {collapsable ? (
          <ArrowIcon up={open} className={classes.expandIcon} />
        ) : null}
      </Row>
    </Collapsable>
  );
};
