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
    padding: theme.spacing(2),
    transition: "0.2s ease all",
    "& + &": {
      marginTop: theme.spacing(2),
    },
    "&:hover": {
      background: "rgba(217, 212, 173, 0.15)",
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
