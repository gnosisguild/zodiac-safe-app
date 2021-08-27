import React from "react";
import { BoxProps, makeStyles } from "@material-ui/core";
import classNames from "classnames";

type RowProps = Omit<BoxProps, "display" | "flexDirection">;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
}));

export const Row = ({ className, ...props }: RowProps) => {
  const classes = useStyles();
  return <div className={classNames(classes.root, className)} {...props} />;
};
