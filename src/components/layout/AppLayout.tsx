import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    height: "100%",
    gridTemplateColumns:"380px 1fr"
  },
  leftPanel: {
    overflowY: "auto",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    position: "relative",
    overflowY: "auto",
  },
}));

interface AppLayoutProps {
  left: React.ReactElement;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, left }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.leftPanel}>{left}</div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};
