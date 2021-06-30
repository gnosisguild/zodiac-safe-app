import React, { useRef, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Button, makeStyles } from "@material-ui/core";
import { ContractFunctionParamInput } from "./ContractFunctionParamInput";
import { validateFunctionParams } from "../../../utils/contracts";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play-icon.svg";

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
    textTransform: "none",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
    color: theme.palette.secondary.main + " !important",
    borderColor: theme.palette.secondary.main + " !important",
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
        classes={{ disabled: classes.buttonDisabled }}
        className={classes.queryButton}
        onClick={handleQuery}
        startIcon={<PlayIcon className={classes.icon} />}
      >
        Run Query
      </Button>
    </>
  );
};
