import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Typography } from "@material-ui/core";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { Module } from "../../../store/modules/models";
import { DelayModuleItem } from "./DelayModuleItem";
import { isDelayModule } from "../../../store/modules/helpers";
import { ModuleList } from "../ModuleList";
import { RemoveIcon } from "../../../components/icons/RemoveIcon";
import { Address } from "../../../components/ethereum/Address";

interface ModuleItemProps extends PanelItemProps {
  remove?: boolean;
  instant?: boolean;
  module: Module;
}

const useStyles = makeStyles(() => ({
  text: {
    lineHeight: 1,
  },
}));

export const ModuleItem = ({
  module,
  remove = false,
  instant = false,
  ...panelItemProps
}: ModuleItemProps) => {
  const classes = useStyles();

  if (isDelayModule(module))
    return (
      <DelayModuleItem module={module} remove={remove} {...panelItemProps} />
    );

  return (
    <>
      <PanelItem
        image={
          remove ? (
            <RemoveIcon instant={instant} />
          ) : (
            <HashInfo
              showAvatar
              avatarSize="lg"
              showHash={false}
              hash={module.address}
            />
          )
        }
        {...panelItemProps}
      >
        <Typography variant="h6" className={classes.text} gutterBottom>
          {module.name}
        </Typography>
        <Address
          short
          showOnHover
          address={module.address}
          spacing={0}
          iconSpacing={1}
          variant="body2"
          className={classes.text}
        />
      </PanelItem>

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </>
  );
};
