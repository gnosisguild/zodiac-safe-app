import React, { useRef, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Button, makeStyles } from "@material-ui/core";
import { Icon } from "@gnosis.pm/safe-react-components";
import { ContractFunctionParamInput } from "./ContractFunctionParamInput";
import { validateFunctionParams } from "../../../utils/contracts";

interface ContractFunctionInputProps {
  func: FunctionFragment;

  onQuery(params: any[]): void;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.secondary.main,
  },
  queryButton: {
    marginTop: theme.spacing(2),
  },
}));

type ParamValue = { value: any; valid: boolean };

export const ContractFunctionQuery = ({
  func,
  onQuery,
}: ContractFunctionInputProps) => {
  const classes = useStyles();

  const params = useRef<ParamValue[]>(
    func.inputs.map((_) => ({ value: "", valid: true }))
  );

  const validate = () => {
    return validateFunctionParams(
      func,
      params.current.map((_param) => _param.value)
    );
  };

  const [areParamsValid, setParamsValid] = useState(validate());

  if (!func.inputs?.length) return null;

  const handleParamChange = (index: number, value: any, valid: boolean) => {
    params.current[index] = { value, valid };
    const _areParamsValid = params.current.every((param) => param.valid);
    setParamsValid(_areParamsValid && validate());
  };

  const handleQuery = () => {
    onQuery(params.current.map((param) => param.value));
  };

  const fields = func.inputs.map((param, index) => {
    return (
      <ContractFunctionParamInput
        key={index}
        param={param}
        onChange={(value, valid) => {
          handleParamChange(index, value, valid);
        }}
      />
    );
  });

  return (
    <>
      {fields}

      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        disabled={!areParamsValid}
        className={classes.queryButton}
        onClick={handleQuery}
        startIcon={
          <Icon
            color={!areParamsValid ? undefined : "primary"}
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
};
