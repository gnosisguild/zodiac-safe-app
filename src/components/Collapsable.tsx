import React from "react";
import { makeStyles, Paper, PaperProps } from "@material-ui/core";
import classNames from "classnames";

interface CollapsableProps extends PaperProps {
  open?: boolean;
  content?: React.ReactElement;
  containerClassName?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 2, 2, 2),
    "& + &": {
      marginTop: theme.spacing(2),
    },
  },
  content: {
    marginTop: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}));

export const Collapsable: React.FC<CollapsableProps> = ({
  open = false,
  content,
  children,
  className,
  containerClassName,
  ...props
}) => {
  const classes = useStyles();
  console.log(className);
  return (
    <Paper {...props} className={classNames(classes.root, className)}>
      {children}
      {content ? (
        <div
          className={classNames(classes.content, containerClassName, {
            [classes.hide]: !open,
          })}
        >
          {content}
        </div>
      ) : null}
    </Paper>
  );
};
