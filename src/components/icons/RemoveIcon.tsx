import React from "react";
import { LoadingIcon } from "./LoadingIcon";
import { ReactComponent as TrashIcon } from "../../assets/icons/delete-icon.svg";
import { ReactComponent as RemoveStateIcon } from "../../assets/images/remove-pending-state.svg";

interface RemoveIconProps {
  instant?: boolean;
}

export const RemoveIcon = ({ instant = false }: RemoveIconProps) => {
  if (instant) return <LoadingIcon icon={<TrashIcon />} />;
  return <RemoveStateIcon />;
};
