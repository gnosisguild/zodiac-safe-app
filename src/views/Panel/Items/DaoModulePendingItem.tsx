import React from "react";
import { ModulePendingItem } from "./ModulePendingItem";
import { LoadingIcon } from "../../../components/icons/LoadingIcon";
import { ReactComponent as ModulePendingImg } from "../../../assets/images/dao-module-pending.svg";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { PanelItemProps } from "./PanelItem";

interface DaoModulePendingItemProps extends PanelItemProps {
  instant?: boolean;
}

export const DaoModulePendingItem = ({
  instant,
  ...props
}: DaoModulePendingItemProps) => {
  if (instant)
    return (
      <ModulePendingItem
        title="DAO Module"
        linkText="Transaction confirming..."
        image={<LoadingIcon icon={<AddIcon />} />}
        {...props}
      />
    );

  return (
    <ModulePendingItem
      title="DAO Module"
      linkText="Awaiting approval"
      image={<ModulePendingImg />}
      {...props}
    />
  );
};
