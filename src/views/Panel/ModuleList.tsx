import { Box, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { HashInfo } from "../../components/ethereum/HashInfo";
import classNames from "classnames";
import { Module, setCurrentModule, useModules } from "../../contexts/modules";

interface ModuleListProps {
  modules: Module[];
}

const useStyles = makeStyles((theme) => {
  return {
    moduleItem: {
      padding: "24px 16px 24px 16px",
      cursor: "pointer",

      borderRadius: 0,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: theme.palette.divider,
      borderStyle: "solid",

      transition: theme.transitions.create("border", {
        duration: 200,
        easing: "ease",
      }),

      backgroundColor: theme.palette.background.default,

      "&:hover": {
        backgroundColor: theme.palette.background.paper,
      },
      "&:first-child": {
        borderTopWidth: 1,
      },
      "&.active": {
        backgroundColor: theme.palette.background.paper,
        borderLeftStyle: "solid",
        borderLeftWidth: 3,
        borderLeftColor: theme.palette.secondary.main,
      },
    },
  };
});

export const ModuleList = ({ modules }: ModuleListProps) => {
  const classes = useStyles();
  const { state, dispatch } = useModules();

  const handleClick = (module: Module) => {
    dispatch(setCurrentModule(module));
  };

  return (
    <Box display="flex" flexDirection="column">
      {modules.map((module) => {
        const active = module.address === state.current?.address;
        return (
          <Paper
            elevation={0}
            key={module.address}
            onClick={() => handleClick(module)}
            className={classNames(classes.moduleItem, { active })}
          >
            <HashInfo
              showAvatar
              shortenHash={4}
              hash={module.address}
              name={module.name}
            />
          </Paper>
        );
      })}
    </Box>
  );
};
