import React from "react";
import { makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    height: "100%",
    gridTemplateColumns: "390px 1fr",
    gridGap: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    overflow: "hidden",
    padding: theme.spacing(1.5),
  },
  leftPanel: {
    overflowY: "auto",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    overflow: "hidden",
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
