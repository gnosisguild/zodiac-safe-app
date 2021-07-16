import React, { useState } from "react";
import { TextField, TextFieldProps } from "./TextField";
import { InputAdornment, InputBase, withStyles } from "@material-ui/core";

interface TimeSelectProps extends Omit<TextFieldProps, "onChange"> {
  onChange(time: number): void;
}

const AmountInput = withStyles((theme) => ({
  root: {
    "& input": {
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: theme.palette.secondary.main,
      paddingRight: theme.spacing(1),
      textAlign: "right",
    },
  },
}))(InputBase);

const unitConversion = {
  hours: 3600,
  minutes: 60,
};
type Unit = keyof typeof unitConversion;

function calculateTime(amount: number, unit: Unit) {
  return amount * unitConversion[unit];
}

export const TimeSelect = ({ onChange, ...props }: TimeSelectProps) => {
  const [unit, setUnit] = useState<Unit>("hours");
  const [amount, setAmount] = useState("");

  const handleAmountChange = (_amount: string) => {
    const newAmount = parseInt(_amount || "0");
    if (isNaN(newAmount)) return;
    setAmount(_amount);
    onChange(calculateTime(newAmount, unit));
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    if (amount !== undefined)
      onChange(calculateTime(parseInt(amount || "0"), newUnit));
  };

  return (
    <TextField
      {...props}
      select
      SelectProps={{ native: true }}
      onChange={(evt) => handleUnitChange(evt.target.value as Unit)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AmountInput
              value={amount}
              placeholder="24"
              onChange={(evt) => handleAmountChange(evt.target.value)}
            />
          </InputAdornment>
        ),
      }}
    >
      {Object.keys(unitConversion).map((unit) => (
        <option key={unit} value={unit}>
          {unit}
        </option>
      ))}
    </TextField>
  );
};
