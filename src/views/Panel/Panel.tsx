import React from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
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
import { ReactComponent as AddIcon } from "../../assets/icons/add-icon.svg";

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
    padding: theme.spacing(0, 1, 2, 1),
    boxSizing: "content-box",
    minHeight: 40,
    alignItems: "center",
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
        <Typography variant="h5">Modules and Modifiers</Typography>
        <Grow />
        {currentModule || currentPending ? (
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={handleAddModule}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        ) : null}
      </Row>

      <ModuleList modules={modulesList} />
    </div>
  );
};
