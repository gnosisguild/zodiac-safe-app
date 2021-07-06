import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Grid } from "@material-ui/core";
import {
  ContractFunctionParamInput,
  ContractFunctionParamInputProps,
} from "../contract/ContractFunctionParamInput";
import { DisplayField } from "../../input/DisplayField";

export type TransactionBlockFieldsProps<Edit = boolean> = Edit extends false
  ? {
      edit: Edit;
      func: FunctionFragment;
      params: any[];
    }
  : {
      edit: Edit;
      paramInputProps: ContractFunctionParamInputProps[];
    };

export const TransactionBlockFields = (props: TransactionBlockFieldsProps) => {
  const fields = props.edit
    ? props.paramInputProps.map((props, index) => {
        return (
          <Grid item key={index} xs={12} md={6}>
            <ContractFunctionParamInput key={index} {...props} />
          </Grid>
        );
      })
    : props.func.inputs.map((param, index) => {
        return (
          <Grid item key={index} xs={12} md={6}>
            <DisplayField
              label={`${param.name} (${param.type})`}
              value={props.params[index]?.toString()}
            />
          </Grid>
        );
      });

  return (
    <Grid container spacing={2}>
      {fields}
    </Grid>
  );
};
