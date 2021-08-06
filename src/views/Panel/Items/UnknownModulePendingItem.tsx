import { ModulePendingItem } from "./ModulePendingItem";
import { ReactComponent as ModulePendingImg } from "../../../assets/images/dao-module-pending.svg";
import React from "react";
import { LoadingIcon } from "../../../components/icons/LoadingIcon";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { PanelItemProps } from "./PanelItem";

interface UnknownModulePendingItemProps extends PanelItemProps {
  instant?: boolean;
}

export const UnknownModulePendingItem = ({
  instant,
  ...props
}: UnknownModulePendingItemProps) => {
  if (instant) {
    return (
      <ModulePendingItem
        title="Custom Module"
        linkText="Transaction confirming..."
        image={<LoadingIcon icon={<AddIcon />} />}
        {...props}
      />
    );
  }

  return (
    <ModulePendingItem
      title="Custom Module"
      linkText="Awaiting approval"
      image={<ModulePendingImg />}
      {...props}
    />
  );
};
