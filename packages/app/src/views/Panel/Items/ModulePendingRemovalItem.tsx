import React from "react";
import { PanelItemProps } from "./PanelItem";
import { Module } from "../../../store/modules/models";
import { ModulePendingItem } from "./ModulePendingItem";
import { LoadingIcon } from "../../../components/icons/LoadingIcon";
import { ReactComponent as TrashIcon } from "../../../assets/icons/delete-icon.svg";
import { ReactComponent as RemovePendingStateImg } from "../../../assets/images/remove-pending-state.svg";

interface ModulePendingRemovalProps extends PanelItemProps {
  module: Module;
  instant?: boolean;
}

export const ModulePendingRemoval = ({
  instant,
  module,
  ...props
}: ModulePendingRemovalProps) => {
  if (instant) {
    return (
      <ModulePendingItem
        title={module.name || ""}
        linkText="Transaction confirming..."
        image={<LoadingIcon icon={<TrashIcon />} />}
        {...props}
      />
    );
  }

  return (
    <ModulePendingItem
      title={module.name || ""}
      linkText="Awaiting removal approval"
      image={<RemovePendingStateImg />}
      {...props}
    />
  );
};
