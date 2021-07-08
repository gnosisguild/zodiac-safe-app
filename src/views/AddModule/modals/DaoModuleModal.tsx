import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DaoModuleImage } from "../../../assets/images/dao-module.svg";
import React from "react";

interface DaoModuleModalProps {
  open: boolean;

  onClose?(): void;
}

export const DaoModuleModal = ({ open, onClose }: DaoModuleModalProps) => {
  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="DAO Module"
      description="Allows Reality.eth questions to execute a transaction when resolved."
      image={<DaoModuleImage />}
      tags={["Stackable", "Has SafeApp", "From Gnosis"]}
      onAdd={() => {}}
      readMoreLink="https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module"
    />
  );
};
