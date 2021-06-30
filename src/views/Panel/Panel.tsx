import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Button, Title } from "@gnosis.pm/safe-react-components";
import { ModuleList } from "./ModuleList";
import { useModulesState } from "../../contexts/modules";

const useStyles = makeStyles((theme) => ({
  hashInfo: {
    "& p": {
      color: theme.palette.text.primary + " !important",
    },
  },
  content: {
    padding: theme.spacing(3),
  },
  smallButton: {
    minWidth: "auto !important",
    height: "auto !important",
    padding: "8px 12px 8px 12px !important",
    borderRadius: "2px !important",
  },
  moduleList: {
    marginTop: theme.spacing(3),
  },
}));

export const Panel = () => {
  const classes = useStyles();
  const { list: modulesList } = useModulesState();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        className={classes.content}
      >
        <Title size="sm" strong withoutMargin>
          <span style={{ letterSpacing: -1, fontSize: 28 }}>
            Module Manager
          </span>
        </Title>
        <Box flexGrow={1} />
        <Button
          className={classes.smallButton}
          variant="outlined"
          size="md"
          color="primary"
          iconType="add"
        >
          Add
        </Button>
      </Box>

      <ModuleList modules={modulesList} />
    </Box>
  );
};
