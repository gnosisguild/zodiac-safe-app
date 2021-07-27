import { ModulePendingItem } from "./ModulePendingItem";
import { ReactComponent as ModulePendingImg } from "../../../assets/images/dao-module-pending.svg";
import React from "react";
import { LoadingIcon } from "../../../components/icons/LoadingIcon";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/icons/delete-icon.svg";
import { ReactComponent as RemoveModulePendingImg } from "../../../assets/images/remove-pending-state.svg";

interface DelayModulePendingItemProps {
  remove?: boolean;
  instant?: boolean;
}

export const DelayModulePendingItem = ({
  remove,
  instant,
}: DelayModulePendingItemProps) => {
  if (remove) {
    if (instant)
      return (
        <ModulePendingItem
          title="Delay Module Removal"
          linkText="Transaction confirming..."
          image={<LoadingIcon icon={<RemoveIcon />} />}
        />
      );

    return (
      <ModulePendingItem
        title="Delay Module Removal"
        linkText="Awaiting approval"
        image={<RemoveModulePendingImg />}
      />
    );
  }

  if (instant) {
    return (
      <ModulePendingItem
        title="Delay Module"
        linkText="Transaction confirming..."
        image={<LoadingIcon icon={<AddIcon />} />}
      />
    );
  }

  return (
    <ModulePendingItem
      title="Delay Module"
      linkText="Awaiting approval"
      image={<ModulePendingImg />}
    />
  );
};
