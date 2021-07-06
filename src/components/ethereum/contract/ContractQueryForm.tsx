import React, { useRef, useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { validateFunctionParams } from "../../../utils/contracts";
import { ContractFunctionParamInputProps } from "./ContractFunctionParamInput";

type ParamValue = { value: any; valid: boolean };

interface ContractQueryFormProps {
  func: FunctionFragment;
  defaultParams?: any[];

  children(props: {
    paramInputProps: ContractFunctionParamInputProps[];
    getParams: () => any[];
    areParamsValid: boolean;
  }): React.ReactElement;
}

export const ContractQueryForm = ({
  defaultParams,
  func,
  children,
}: ContractQueryFormProps) => {
  const params = useRef<ParamValue[]>(
    func.inputs.map((_, index) => ({
      value:
        defaultParams && defaultParams[index] !== undefined
          ? defaultParams[index]
          : "",
      valid: true,
    }))
  );

  const validate = () => {
    return validateFunctionParams(
      func,
      params.current.map((_param) => _param.value)
    );
  };

  const [areParamsValid, setParamsValid] = useState(validate());

  const handleParamChange = (index: number, value: any, valid: boolean) => {
    params.current[index] = { value, valid };
    const _areParamsValid = params.current.every((param) => param.valid);
    setParamsValid(_areParamsValid && validate());
  };

  const paramInputProps: ContractFunctionParamInputProps[] = func.inputs.map(
    (param, index) => {
      return {
        param: param,
        value: params.current[index].value,
        onChange: (value: any, valid: boolean) => {
          handleParamChange(index, value, valid);
        },
      };
    }
  );

  const getParams = () => params.current.map((param) => param.value);

  return children({ paramInputProps, getParams, areParamsValid });
};
