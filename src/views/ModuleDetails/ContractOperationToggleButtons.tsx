import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/core";

const StyledToggleButton = withStyles((theme) => ({
  root: {
    width: "50%",
    padding: theme.spacing(1, 2.5),
    "& span": {
      fontSize: 16,
      textTransform: "none",
      color: theme.palette.text.primary + " !important",
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
    <ToggleButtonGroup exclusive size="small" {...props}>
      <StyledToggleButton disabled={disabled} value="read" disableRipple>
        Read Contract
      </StyledToggleButton>
      <StyledToggleButton disabled={disabled} value="write" disableRipple>
        Write Contract
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
};