import React from "react";
import { makeStyles, Paper, PaperProps } from "@material-ui/core";
import classNames from "classnames";

interface CollapsableProps extends PaperProps {
  open?: boolean;
  content?: React.ReactElement;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    "& + &": { marginTop: theme.spacing(2) },
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

export const Collapsable: React.FC<CollapsableProps> = ({
  open = false,
  content,
  children,
  className,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Paper {...props} className={classNames(classes.root, className)}>
      {children}
      {content && open ? (
        <div className={classes.content}>{content}</div>
      ) : null}
    </Paper>
  );
};
