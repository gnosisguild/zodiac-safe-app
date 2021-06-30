import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box } from "@material-ui/core";
import { TextField } from "../../input/TextField";

interface ContractFunctionInputProps {
  func: FunctionFragment;

  onChange(params: string[]): void;
}

export const ContractFunctionInput = ({
  func,
  onChange,
}: ContractFunctionInputProps) => {
  return (
    <>
      {func.inputs?.map((param, index) => {
        const label = param.name
          ? `${param.name} (${param.type})`
          : `(${param.type})`;
        return (
          <Box key={index} marginTop={2}>
            <TextField color="secondary" label={label} />
          </Box>
        );
      })}
    </>
  );
};
