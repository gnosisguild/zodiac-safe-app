import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import React from "react";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.secondary.main,
  },
  queryButton: {
    textTransform: "none",
    fontSize: 16,
    "&.MuiButton-contained.Mui-disabled": {
      opacity: 0.5,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    "&.MuiButton-outlinedSecondary.Mui-disabled": {
      opacity: 0.5,
      color: theme.palette.secondary.main + " !important",
      borderColor: theme.palette.secondary.main + " !important",
    },
  },
  buttonDisabled: {},
}));

export const ActionButton = ({ classes, className, ...props }: ButtonProps) => {
  const _classes = useStyles();
  return (
    <Button
      variant="outlined"
      color="secondary"
      classes={{ disabled: _classes.buttonDisabled, ...classes }}
      className={classNames(_classes.queryButton, className)}
      {...props}
    />
  );
};
