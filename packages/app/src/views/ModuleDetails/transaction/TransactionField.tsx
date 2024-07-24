import {
  ParamInput,
  ParamInputProps,
} from "../../../components/ethereum/ParamInput";
import React from "react";

import { TimeSelect } from "../../../components/input/TimeSelect";
import { BigNumberish, FunctionFragment } from "ethers";

interface TransactionFieldProps {
  param: ParamInputProps;
  func: FunctionFragment;
}

export const TransactionField = ({ param, func }: TransactionFieldProps) => {
  if (func.inputs.length === 1) {
    const [input] = func.inputs;
    const isTimeField = ["setTxCooldown", "setTxExpiration"].includes(
      func.name
    );
    const isTime = isTimeField && input.type.includes("int");
    if (isTime) return <TransactionTimeField {...param} />;
  }

  return <ParamInput {...param} />;
};

export const TransactionTimeField = ({
  label,
  value,
  onChange,
  ...props
}: ParamInputProps) => {
  const defaultValue = value || "0";
  return (
    <TimeSelect
      {...props}
      label={label || "Time"}
      defaultValue={defaultValue as BigNumberish}
      defaultUnit="seconds"
      onChange={(time) => onChange(time, true)}
    />
  );
};
