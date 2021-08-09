import React from "react";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  badge: {
    display: "inline-block",
    padding: theme.spacing(0.5),
    lineHeight: 1,
    borderRadius: 4,
    backgroundColor: theme.palette.primary.light,
    whiteSpace: "nowrap",
  },
}));

export const Badge: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const classes = useStyles();
  return (
    <div className={classNames(classes.badge, className)} {...props}>
      {children}
    </div>
  );
};
