import React from "react";
import { makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    height: "calc(100% - 70px)",
    gridTemplateColumns: "390px 1fr",
    gridGap: theme.spacing(0.5),
    borderRadius: 0,
    overflow: "hidden",
    padding: theme.spacing(0.5),
    background: "none",
    "&::before": {
      content: "none",
    },
  },
  leftPanel: {
    overflowY: "auto",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: theme.palette.divider,
    backgroundColor: "none",
  },
  content: {
    overflowY: "auto",
    background: "none",
    "&::before": {
      content: "none",
    },
  },
}));

interface AppLayoutProps {
  left: React.ReactElement;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, left }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Paper className={classes.content}>{left}</Paper>
      <Paper id="app-content" className={classes.content}>
        {children}
      </Paper>
    </Paper>
  );
};
