import React, { useState } from "react";
import { ParamType } from "@ethersproject/abi";
import { TextField } from "../../input/TextField";
import { formatParamValue } from "../../../utils/contracts";

export interface ContractFunctionParamInputProps {
  param: ParamType;
  value?: string | boolean;

  onChange(value: any, valid: boolean): void;
}

function getLabel(param: ParamType) {
  if (param.name) {
    return `${param.name} (${param.type})`;
  }
  return `(${param.type})`;
}

function getDefaultValue(
  param: ParamType,
  defaultValue: ContractFunctionParamInputProps["value"]
): string {
  if (defaultValue !== undefined) {
    if (typeof defaultValue === "object") return JSON.stringify(defaultValue);
    return defaultValue.toString();
  }
  return param.baseType === "boolean" ? "false" : "";
}

export const ContractFunctionParamInput = ({
  param,
  value: defaultValue,
  onChange,
}: ContractFunctionParamInputProps) => {
  const [value, setValue] = useState<string>(
    getDefaultValue(param, defaultValue)
  );
  const [error, setError] = useState<string>();

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const _value = evt.target.value;
    setValue(_value);

    if (param.baseType === "boolean") {
      onChange(_value === "true", true);
      return;
    }

    if (!_value.length) {
      onChange(_value, true);
      setError(undefined);
      return;
    }

    try {
      const paramValue = formatParamValue(param, _value);
      onChange(paramValue, true);
      setError(undefined);
    } catch (error) {
      onChange(_value, false);
      setError(error.message);
    }
  };

  if (param.baseType === "boolean") {
    return (
      <TextField
        select
        color="secondary"
        label={getLabel(param)}
        value={value}
        onChange={handleChange}
        SelectProps={{ native: true }}
      >
        <option value="true">True</option>
        <option value="false">True</option>
      </TextField>
    );
  }

  return (
    <TextField
      color="secondary"
      label={getLabel(param)}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
    />
  );
};
