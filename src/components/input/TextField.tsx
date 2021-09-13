import React from "react";
import {
  TextField as MUITextField,
  withStyles,
  StandardTextFieldProps,
} from "@material-ui/core";

const StyledTextField = withStyles((theme) => ({
  root: {
    "& label.Mui-focused": {
      position: "relative",
      transform: "none",
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
    },
    "& .MuiInputBase-root": {
      marginTop: 0,
    },
    "& .MuiInputBase-root input": {
      fontFamily: "Roboto Mono",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent",
    },
  },
}))(MUITextField);

export interface TextFieldProps
  extends Omit<StandardTextFieldProps, "variant" | "label"> {
  label?: string;
}

export const TextField = ({
  InputProps,
  InputLabelProps,
  label,
  ...props
}: TextFieldProps) => {
  return (
    <StyledTextField
      focused={!props.disabled}
      label={label}
      placeholder={label}
      InputProps={{
        disableUnderline: true,
        ...InputProps,
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      {...props}
    />
  );
};
