import { Box, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { HashInfo } from "../../components/ethereum/HashInfo";
import classNames from "classnames";
import { Module, setCurrentModule, useModules } from "../../contexts/modules";

interface ModuleListProps {
  modules: Module[];
  sub?: boolean;
}

const ITEM_HEIGHT = 90;

const useStyles = makeStyles((theme) => ({
  moduleItem: {
    padding: "24px 16px 24px 16px",
    cursor: "pointer",

    height: ITEM_HEIGHT,

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
    "&.active": {
      backgroundColor: theme.palette.background.default,
      borderLeftStyle: "solid",
      borderLeftWidth: 3,
      borderLeftColor: theme.palette.secondary.main,
    },
  },
  subModules: {
    position: "relative",
    marginLeft: theme.spacing(10),
  },
  line: {
    position: "absolute",
    borderColor: theme.palette.primary.light,
    borderStyle: "solid",
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
    top: 0,
    left: -40,
    width: 40,
  },
}));

export const ModuleList = ({ modules, sub = false }: ModuleListProps) => {
  const classes = useStyles();
  const { state, dispatch } = useModules();

  const handleClick = (module: Module) => {
    dispatch(setCurrentModule(module));
  };

  const content = modules.map((module) => {
    const active = module.address === state.current?.address;
    return (
      <>
        <Paper
          elevation={0}
          key={module.address}
          onClick={() => handleClick(module)}
          className={classNames(classes.moduleItem, { active, sub })}
        >
          <HashInfo
            showAvatar
            shortenHash={4}
            hash={module.address}
            name={module.name}
          />
        </Paper>
        {module.subModules.length ? (
          <ModuleList sub modules={module.subModules} />
        ) : null}
      </>
    );
  });

  if (sub) {
    const lines = modules.map((_, index) => (
      <div
        className={classes.line}
        style={{ height: (index + 1) * ITEM_HEIGHT - ITEM_HEIGHT / 2 + 2 }}
      />
    ));
    return (
      <div className={classes.subModules}>
        {content}
        {lines}
      </div>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      {content}
    </Box>
  );
};
