import React, { useState } from "react";
import { ParamType } from "@ethersproject/abi";
import { Box } from "@material-ui/core";
import { TextField } from "../../input/TextField";
import { formatParamValue } from "../../../utils/contracts";

interface ContractFunctionParamInputProps {
  param: ParamType;
  onChange(value: any, valid: boolean): void;
}

function getLabel(param: ParamType) {
  if (param.name) {
    return `${param.name} (${param.type})`;
  }
  return `(${param.type})`;
}

export const ContractFunctionParamInput = ({
  param,
  onChange,
}: ContractFunctionParamInputProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const _value = evt.target.value;
    setValue(_value);

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

  return (
    <Box marginTop={2}>
      <TextField
        color="secondary"
        label={getLabel(param)}
        value={value}
        onChange={handleChange}
        error={!!error}
        helperText={error}
      />
    </Box>
  );
};
