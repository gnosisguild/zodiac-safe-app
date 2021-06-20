import React from "react";
import { makeStyles } from "@material-ui/core";
import { Panel } from "./Panel/Panel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    flexDirection: "row",
    flexGrow: 1,
  },
  leftPanel: {
    width: "30%",
    maxWidth: 380,
    minWidth: 270,
    overflowY: "auto",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: theme.palette.divider,
  },
  content: {
    flexGrow: 1,
    overflowY: "auto",
  },
}));

export const AppLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.leftPanel}>
        <Panel />
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  );
};
