import React, { useState } from "react";
import classNames from "classnames";
import { FunctionFragment } from "@ethersproject/abi";
import { makeStyles, Paper, withStyles } from "@material-ui/core";
import { ContractQueryForm } from "../contract/ContractQueryForm";
import { Draggable } from "react-beautiful-dnd";
import { TransactionBlockContent } from "./TransactionBlockContent";

interface ContractFunctionBlockProps {
  id: string;
  isOver: boolean;
  isOverBefore: boolean;
  index: number;
  func: FunctionFragment;
  params: any[];

  onUpdate(id: string, params: any[]): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    paddingBottom: theme.spacing(3.5),
  },
  placeholder: {
    position: "absolute",
    width: "100%",
    borderColor: "#31AAB7",
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: theme.spacing(0.5),
    "&.place-after": {
      bottom: theme.spacing(1.5),
    },
    "&.place-before": {
      top: theme.spacing(-2),
    },
  },
}));

const TransactionBlockPlaceholder = withStyles((theme) => ({
  root: {
    height: 56,
    backgroundColor: theme.palette.primary.light,
  },
}))(Paper);

export const TransactionBlock = ({
  id,
  isOver,
  isOverBefore,
  index,
  func,
  params,
  onUpdate,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [edit, setEdit] = useState(false);

  const handleStartEditing = () => {
    setOpen(true);
    setEdit(true);
  };

  const handleToggleContent = () => {
    if (!edit) setOpen(!open);
  };

  const handleCancelEditing = () => {
    setEdit(false);
  };
  const handleDeleteTransaction = () => {};
  const handleSaveParams = (newParams: any[]) => {
    onUpdate(id, newParams);
    setEdit(false);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provider, snapshot) => (
        <div className={classNames(classes.root, { over: isOver })}>
          {edit ? (
            <ContractQueryForm func={func} defaultParams={params}>
              {({ paramInputProps, areParamsValid, getParams }) => (
                <TransactionBlockContent
                  edit
                  open={open}
                  drag={{ provider, snapshot }}
                  blockFieldsProps={{ edit: true, paramInputProps }}
                  headerTitleProps={{
                    title: func.name,
                    onToggle: handleToggleContent,
                  }}
                  headerButtonProps={{
                    disabled: !areParamsValid,
                    onCancel: handleCancelEditing,
                    onSave: () => handleSaveParams(getParams()),
                  }}
                />
              )}
            </ContractQueryForm>
          ) : (
            <TransactionBlockContent
              open={open}
              drag={{ provider, snapshot }}
              blockFieldsProps={{ edit: false, params, func }}
              headerTitleProps={{
                title: func.name,
                onToggle: handleToggleContent,
              }}
              headerButtonProps={{
                onEdit: handleStartEditing,
                onDelete: handleDeleteTransaction,
              }}
            />
          )}
          {isOver && (
            <div
              className={classNames(classes.placeholder, {
                "place-after": !isOverBefore,
                "place-before": isOverBefore,
              })}
            />
          )}
          {snapshot.isDragging && <TransactionBlockPlaceholder elevation={0} />}
        </div>
      )}
    </Draggable>
  );
};
