import React from "react";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
import { Column } from "../../../components/layout/Column";

export interface PanelItemProps {
  active?: boolean;
  sub?: boolean;
  image?: React.ReactElement | null;

  onClick?(): void;
}

export const PANEL_ITEM_HEIGHT = 56;
export const PANEL_ITEM_MARGIN = 12;

const useStyles = makeStyles((theme) => ({
  moduleItem: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    gridGap: theme.spacing(2),
    cursor: "pointer",

    height: PANEL_ITEM_HEIGHT,

    // borderRadius: 0,
    // borderWidth: 0,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: theme.palette.divider,
    // borderStyle: "solid",

    transition: theme.transitions.create("border", {
      duration: 100,
      easing: "ease",
    }),

    backgroundColor: "transparent",

    "& + &": {
      borderTopWidth: 0,
    },
    "&:hover": {
      // backgroundColor: theme.palette.background.default,
    },
    "&.sub": {
      // borderLeftStyle: "solid",
      // borderTopWidth: 0,
      // borderLeftWidth: 1,
      // borderLeftColor: theme.palette.divider,
      zIndex: 2,
    },
    "&.cursor": {
      cursor: "auto",
    },
    "&.active": {
      // backgroundColor: theme.palette.background.default,
      // borderLeftStyle: "solid",
      // borderLeftWidth: 3,
      // borderLeftColor: theme.palette.secondary.main,
    },
  },
  content: {
    width: "100%",
    justifyContent: "center",
  },
}));

export const PanelItem: React.FC<PanelItemProps> = ({
  active,
  sub,
  image = null,
  children,
  onClick,
}) => {
  const classes = useStyles();
  return (
    <div
      onClick={active ? undefined : onClick}
      className={classNames(classes.moduleItem, {
        active,
        sub,
        cursor: active || !onClick,
      })}
    >
      {image}
      <Column className={classes.content}>{children}</Column>
    </div>
  );
};
