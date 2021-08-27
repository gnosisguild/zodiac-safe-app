import React from "react";
import { BoxProps, makeStyles } from "@material-ui/core";
import classNames from "classnames";

type ColumnProps = Omit<BoxProps, "display" | "flexDirection">;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const Column = ({ className, ...props }: ColumnProps) => {
  const classes = useStyles();
  return <div className={classNames(classes.root, className)} {...props} />;
};
