import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import {
  DraggableProvided,
  DraggableStateSnapshot,
  Omit,
} from "react-beautiful-dnd";
import { Row } from "../../../components/layout/Row";
import { ReactComponent as GripIcon } from "../../../assets/icons/grip-icon.svg";
import { Collapsable } from "../../../components/Collapsable";
import {
  TransactionBlockHeaderButtons,
  TransactionBlockHeaderButtonsProps,
} from "./TransactionBlockHeaderButtons";
import {
  TransactionBlockFields,
  TransactionBlockFieldsProps,
} from "./TransactionBlockFields";
import {
  TransactionBlockHeaderTitle,
  TransactionBlockHeaderTitleProps,
} from "./TransactionBlockHeaderTitle";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "0 !important",
    padding: 0,
  },
  collapsableContainer: {
    margin: 0,
    padding: theme.spacing(1, 2, 2, 2),
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
  grip: {
    display: "flex",
    cursor: "grab",
    padding: theme.spacing(2),
  },
}));

type TransactionBlockContentProps<Edit = boolean> = {
  open: boolean;
  edit?: Edit;
  drag: {
    provider: DraggableProvided;
    snapshot: DraggableStateSnapshot;
  };
  blockFieldsProps: TransactionBlockFieldsProps<Edit>;
  headerTitleProps: Omit<TransactionBlockHeaderTitleProps, "open" | "edit">;
  headerButtonProps: Omit<TransactionBlockHeaderButtonsProps, "edit">;
};

export const TransactionBlockContent = ({
  open,
  edit = false,
  headerButtonProps,
  headerTitleProps,
  blockFieldsProps,
  drag,
}: TransactionBlockContentProps) => {
  const classes = useStyles();

  return (
    <Collapsable
      open={open}
      innerRef={drag.provider.innerRef}
      {...drag.provider.draggableProps}
      containerClassName={classes.collapsableContainer}
      className={classNames(classes.container, {
        [classes.dragging]: drag.snapshot.isDragging,
        [classes.noDragging]: !drag.snapshot.isDragging,
        [classes.dropAnimation]: drag.snapshot.isDropAnimating,
      })}
      content={<TransactionBlockFields {...blockFieldsProps} />}
    >
      <Row alignItems="center">
        <div className={classes.grip} {...drag.provider.dragHandleProps}>
          <GripIcon />
        </div>
        <TransactionBlockHeaderTitle
          open={open}
          edit={edit}
          {...headerTitleProps}
        />
        <TransactionBlockHeaderButtons edit={edit} {...headerButtonProps} />
      </Row>
    </Collapsable>
  );
};
