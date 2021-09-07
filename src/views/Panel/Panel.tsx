import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { Button } from "@gnosis.pm/safe-react-components";
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
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1.5),
    overflowY: "auto",
  },
  hashInfo: {
    "& p": {
      color: theme.palette.text.primary + " !important",
    },
  },
  header: {
    padding: theme.spacing(1),
    boxSizing: "content-box",
    minHeight: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
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
    <div className={classes.root}>
      <Row className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          Modules and Modifiers
        </Typography>
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
    </div>
  );
};
