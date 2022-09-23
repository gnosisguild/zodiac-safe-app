import React from "react";
import {
  Checkbox as MUICheckbox,
  CheckboxProps,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as CheckMarkCheckedIcon } from "../../assets/icons/checkbox-checked.svg";
import { ReactComponent as CheckMarkUncheckedIcon } from "../../assets/icons/checkbox-unchecked.svg";

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    backgroundColor: "transparent !important",
    borderRadius: 0,
  },
}));

export const Checkbox = ({ ...props }: CheckboxProps) => {
  const classes = useStyles();

  return (
    <MUICheckbox
      disableFocusRipple
      disableRipple
      disableTouchRipple
      icon={<CheckMarkUncheckedIcon />}
      checkedIcon={<CheckMarkCheckedIcon />}
      classes={{ root: classes.root }}
      {...props}
    />
  );
};
