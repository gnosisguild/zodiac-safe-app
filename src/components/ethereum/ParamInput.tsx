import React, { useState } from "react";
import { ParamType } from "@ethersproject/abi";
import { TextField, TextFieldProps } from "../input/TextField";
import { formatParamValue } from "../../utils/contracts";
import { MenuItem } from "@material-ui/core";
import { BigNumber } from "ethers";

export interface ParamInputProps
  extends Omit<TextFieldProps, "onChange" | "value" | "label"> {
  param: ParamType;
  value?: string | boolean | BigNumber;
  label?: string;

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
  defaultValue: ParamInputProps["value"]
): string {
  if (defaultValue !== undefined) {
    if (typeof defaultValue === "object") return JSON.stringify(defaultValue);
    return defaultValue.toString();
  }
  return param.baseType === "boolean" ? "false" : "";
}

export const ParamInput = ({
  param,
  value: defaultValue,
  onChange,
  ...props
}: ParamInputProps) => {
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
      onChange(_value, false);
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
        {...props}
      >
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">True</MenuItem>
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
      {...props}
    />
  );
};
