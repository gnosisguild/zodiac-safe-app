import React from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Grid } from "@material-ui/core";
import {
  ParamInput,
  ParamInputProps,
} from "../../../components/ethereum/ParamInput";
import { DisplayField } from "../../../components/input/DisplayField";

export type TransactionBlockFieldsProps<Edit = boolean> = Edit extends false
  ? {
      edit: Edit;
      func: FunctionFragment;
      params: any[];
    }
  : {
      edit: Edit;
      paramInputProps: ParamInputProps[];
    };

export const TransactionBlockFields = (props: TransactionBlockFieldsProps) => {
  const fields = props.edit
    ? props.paramInputProps.map((props, index) => {
        return (
          <Grid item key={index} xs={12} md={6}>
            <ParamInput key={index} {...props} />
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
