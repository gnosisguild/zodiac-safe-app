import React, { HTMLProps } from "react";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  tag: {
    display: "inline-block",
    borderRadius: 8,
    lineHeight: 1,
    padding: theme.spacing(0.75, 0.5),
    margin: theme.spacing(0, 1, 1, 0),
    backgroundColor: "rgba(0,20,40,0.5)",
    color: theme.palette.common.white,
  },
}));

export const Tag: React.FC<HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const classes = useStyles();
  return (
    <div className={classNames(classes.tag, className)} {...props}>
      {children}
    </div>
  );
};
