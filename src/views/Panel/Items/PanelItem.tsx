import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import classNames from "classnames";
import { Column } from "../../../components/layout/Column";

export interface PanelItemProps {
  active?: boolean;
  sub?: boolean;
  image?: React.ReactElement | null;

  onClick?(): void;
}

export const PANEL_ITEM_CONTENT_HEIGHT = 56;
export const PANEL_ITEM_PADDING = 8;
export const PANEL_ITEM_HEIGHT =
  PANEL_ITEM_CONTENT_HEIGHT + PANEL_ITEM_PADDING * 2 + 2;
export const PANEL_ITEM_MARGIN = 12;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: PANEL_ITEM_PADDING,
  },
  active: {
    backgroundColor: "rgba(0, 0, 0, 0.54)",
    borderColor: theme.palette.common.white,
  },
  spacing: {
    "& + &, &.sub": {
      marginTop: PANEL_ITEM_MARGIN,
    },
  },

  moduleItem: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    gridGap: theme.spacing(2),
    cursor: "pointer",

    backgroundColor: "transparent",

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
    <Paper
      className={classNames(classes.root, classes.spacing, {
        sub,
        [classes.active]: active,
      })}
    >
      <div
        onClick={active ? undefined : onClick}
        className={classNames(classes.moduleItem, {
          active,
          sub,
          cursor: active || !onClick,
        })}
      >
        <div>{image}</div>
        <Column className={classes.content}>{children}</Column>
      </div>
    </Paper>
  );
};
