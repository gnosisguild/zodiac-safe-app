import React, { useState } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import {
  Grid,
  makeStyles,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import { ContractQueryForm } from "../contract/ContractQueryForm";
import { Draggable } from "react-beautiful-dnd";
import { Row } from "../../layout/Row";
import { ReactComponent as GripIcon } from "../../../assets/icons/grip-icon.svg";
import { Collapsable } from "../../Collapsable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";

interface ContractFunctionBlockProps {
  id: string;
  isOver: boolean;
  index: number;
  func: FunctionFragment;
  params: any[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "0 !important",
    marginBottom: theme.spacing(3.5),
  },
  title: {
    flexGrow: 1,
    cursor: "pointer",
  },
  grip: {
    cursor: "grab",
    padding: theme.spacing(2),
    margin: theme.spacing(-2, 0, -2, -2),
  },
  expandIcon: {
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  dragging: {
    borderColor: "#31AAB7",
    borderStyle: "solid",
    borderWidth: 2,
  },
  noDragging: {
    transform: "none !important",
  },
  dropAnimation: {
    transitionDuration: "0.001s !important",
  },
  over: {
    marginBottom: theme.spacing(1.5),
  },
  placeholder: {
    borderColor: "#31AAB7",
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
  },
}));

const TransactionBlockPlaceholder = withStyles((theme) => ({
  root: {
    height: 56,
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(3.5),
  },
}))(Paper);

export const TransactionBlock = ({
  id,
  isOver,
  index,
  func,
  params,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const content = (
    <ContractQueryForm func={func} defaultParams={params}>
      {({ fields }) => (
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item key={index} xs={12} md={6}>
              {field}
            </Grid>
          ))}
        </Grid>
      )}
    </ContractQueryForm>
  );

  const arrow = open ? (
    <ExpandLessIcon className={classes.expandIcon} />
  ) : (
    <ExpandMoreIcon className={classes.expandIcon} />
  );

  return (
    <Draggable draggableId={id} index={index}>
      {(provider, snapshot) => (
        <>
          <Collapsable
            open={open}
            innerRef={provider.innerRef}
            content={content}
            className={classNames(classes.root, {
              [classes.over]: isOver,
              [classes.dragging]: snapshot.isDragging,
              [classes.noDragging]: !snapshot.isDragging,
              [classes.dropAnimation]: snapshot.isDropAnimating,
            })}
            {...provider.draggableProps}
          >
            <Row alignItems="center" onClick={() => setOpen(!open)}>
              <div className={classes.grip} {...provider.dragHandleProps}>
                <GripIcon />
              </div>
              <div className={classes.title}>
                <Typography variant="h6">{func.name}</Typography>
              </div>
              {arrow}
            </Row>
          </Collapsable>
          {isOver ? <div className={classes.placeholder} /> : null}
          {snapshot.isDragging ? (
            <TransactionBlockPlaceholder elevation={0} />
          ) : null}
        </>
      )}
    </Draggable>
  );
};
