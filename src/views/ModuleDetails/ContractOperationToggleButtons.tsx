import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/core";

const StyledToggleButtonGroup = withStyles(() => ({
  root: {
    display: "flex",
    borderRadius: 0,
    position: "relative",
    margin: 2,
    border: "1px solid rgba(217, 212, 173, 0.3)",

    "&::before": {
      content: '" "',
      position: "absolute",
      zIndex: -1,
      top: -3,
      left: -3,
      right: -3,
      bottom: -3,
      border: "1px solid rgba(217, 212, 173, 0.3)",
      backgroundColor: "rgba(217, 212, 173, 0.1)",
    },
  },
}))(ToggleButtonGroup);

const StyledToggleButton = withStyles((theme) => ({
  root: {
    width: "50%",
    border: 0,
    borderRadius: 0,
    padding: theme.spacing(1, 2.5),
    backgroundColor: "rgba(217, 212, 173, 0.1)",
    "& span": {
      fontSize: 16,
      textTransform: "none",
      color: theme.palette.text.primary + " !important",
    },
    "&.Mui-disabled": {
      opacity: 0.5,
    },
  },
  selected: {
    backgroundColor: theme.palette.secondary.main + " !important",
  },
}))(ToggleButton);

interface ContractOperationToggleButtonsProps extends ToggleButtonGroupProps {
  disabled?: boolean;
}

export const ContractOperationToggleButtons = ({
  disabled = false,
  ...props
}: ContractOperationToggleButtonsProps) => {
  return (
    <StyledToggleButtonGroup exclusive size="small" {...props}>
      <StyledToggleButton disabled={disabled} value="read" disableRipple>
        Read Contract
      </StyledToggleButton>
      <StyledToggleButton disabled={disabled} value="write" disableRipple>
        Write Contract
      </StyledToggleButton>
    </StyledToggleButtonGroup>
  );
};
