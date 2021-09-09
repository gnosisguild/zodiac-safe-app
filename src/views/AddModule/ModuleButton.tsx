import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import classNames from "classnames";

interface ModuleButtonProps {
  title: string;
  description: string;
  image: React.ReactElement;
  className?: string;

  onClick(): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  image: {
    display: "flex",
    maxWidth: 60,
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: "50%",

    "& img": {
      width: "100%",
    },
  },
  title: {
    marginBottom: theme.spacing(0.5),
  },
}));

export const ModuleButton = ({
  title,
  description,
  image,
  className,
  onClick,
}: ModuleButtonProps) => {
  const classes = useStyles();
  return (
    <Paper className={classNames(classes.root, className)} onClick={onClick}>
      <div className={classes.image}>{image}</div>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body2" align="center">
        {description}
      </Typography>
    </Paper>
  );
};
