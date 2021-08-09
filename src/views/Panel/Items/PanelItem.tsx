import React from "react";
import { makeStyles, Paper, PaperProps } from "@material-ui/core";
import classNames from "classnames";
import { Column } from "../../../components/layout/Column";

export interface PanelItemProps {
  active?: boolean;
  sub?: boolean;
  image?: React.ReactElement | null;
  PaperProps?: PaperProps;

  onClick?(): void;
}

export const PANEL_ITEM_HEIGHT = 90;

const useStyles = makeStyles((theme) => ({
  moduleItem: {
    display: "grid",
    gridTemplateColumns:"40px 1fr",
    alignItems: "center",
    padding: theme.spacing(0, 2),
    cursor: "pointer",

    height: PANEL_ITEM_HEIGHT,

    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.palette.divider,
    borderStyle: "solid",

    transition: theme.transitions.create("border", {
      duration: 100,
      easing: "ease",
    }),

    backgroundColor: theme.palette.background.paper,

    "& + &": {
      borderTopWidth: 0,
    },
    "&:hover": {
      backgroundColor: theme.palette.background.default,
    },
    "&.sub": {
      borderLeftStyle: "solid",
      borderTopWidth: 0,
      borderLeftWidth: 1,
      borderLeftColor: theme.palette.divider,
      zIndex: 2,
    },
    "&.cursor": {
      cursor: "auto",
    },
    "&.active": {
      backgroundColor: theme.palette.background.default,
      borderLeftStyle: "solid",
      borderLeftWidth: 3,
      borderLeftColor: theme.palette.secondary.main,
    },
  },
  content: {
    marginLeft: theme.spacing(2),
    width: "100%",
  },
}));

export const PanelItem: React.FC<PanelItemProps> = ({
  active,
  sub,
  image = null,
  children,
  PaperProps,
  onClick,
}) => {
  const classes = useStyles();
  return (
    <Paper
      elevation={0}
      onClick={active ? undefined : onClick}
      {...PaperProps}
      className={classNames(
        classes.moduleItem,
        { active, sub, cursor: active || !onClick },
        PaperProps?.className
      )}
    >
      {image}
      <Column justifyContent="center" className={classes.content}>
        {children}
      </Column>
    </Paper>
  );
};
