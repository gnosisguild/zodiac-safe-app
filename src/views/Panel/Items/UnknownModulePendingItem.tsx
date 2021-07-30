import { ModulePendingItem } from "./ModulePendingItem";
import { ReactComponent as ModulePendingImg } from "../../../assets/images/dao-module-pending.svg";
import React from "react";
import { LoadingIcon } from "../../../components/icons/LoadingIcon";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/icons/delete-icon.svg";
import { ReactComponent as RemoveModulePendingImg } from "../../../assets/images/remove-pending-state.svg";

interface UnknownModulePendingItemProps {
  remove?: boolean;
  instant?: boolean;
}

export const UnknownModulePendingItem = ({
  remove,
  instant,
}: UnknownModulePendingItemProps) => {
  if (remove) {
    if (instant)
      return (
        <ModulePendingItem
          title="Custom Module Removal"
          linkText="Transaction confirming..."
          image={<LoadingIcon icon={<RemoveIcon />} />}
        />
      );

    return (
      <ModulePendingItem
        title="Custom Module Removal"
        linkText="Awaiting approval"
        image={<RemoveModulePendingImg />}
      />
    );
  }

  if (instant) {
    return (
      <ModulePendingItem
        title="Custom Module"
        linkText="Transaction confirming..."
        image={<LoadingIcon icon={<AddIcon />} />}
      />
    );
  }

  return (
    <ModulePendingItem
      title="Custom Module"
      linkText="Awaiting approval"
      image={<ModulePendingImg />}
    />
  );
};
