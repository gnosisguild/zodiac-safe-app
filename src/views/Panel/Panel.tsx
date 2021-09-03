import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Button, Title } from "@gnosis.pm/safe-react-components";
import { ModuleList } from "./ModuleList";
import { Row } from "../../components/layout/Row";
import { useRootDispatch, useRootSelector } from "../../store";
import {
  getCurrentModule,
  getCurrentPendingModule,
  getModulesList,
} from "../../store/modules/selectors";
import { unsetCurrentModule } from "../../store/modules";
import { Grow } from "../../components/layout/Grow";

const useStyles = makeStyles((theme) => ({
  hashInfo: {
    "& p": {
      color: theme.palette.text.primary + " !important",
    },
  },
  title: {
    fontSize: 20,
  },
  content: {
    padding: theme.spacing(2, 2.5),
    boxSizing: "content-box",
    minHeight: 40,
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
  const dispatch = useRootDispatch();
  const modulesList = useRootSelector(getModulesList);
  const currentModule = useRootSelector(getCurrentModule);
  const currentPending = useRootSelector(getCurrentPendingModule);

  const handleAddModule = () => {
    dispatch(unsetCurrentModule());
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100%">
      <Row style={{ alignItems: "center" }} className={classes.content}>
        <Title size="sm" strong withoutMargin>
          <span className={classes.title}>Module Manager</span>
        </Title>
        <Grow />
        {currentModule || currentPending ? (
          <Button
            className={classes.smallButton}
            variant="outlined"
            size="md"
            color="primary"
            iconType="add"
            onClick={handleAddModule}
          >
            Add
          </Button>
        ) : null}
      </Row>

      <ModuleList modules={modulesList} />
    </Box>
  );
};
