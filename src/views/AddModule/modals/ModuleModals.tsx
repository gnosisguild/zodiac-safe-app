import React from "react";
import { DaoModuleModal } from "./DaoModuleModal";
import { DelayModuleModal } from "./DelayModuleModal";

export enum MODULE_MODAL {
  dao,
  delay,
}

interface ModuleModalsProps {
  selected?: MODULE_MODAL;
  onClose?(): void;
}

export const ModuleModals = ({ selected, onClose }: ModuleModalsProps) => {
  return (
    <>
      <DaoModuleModal open={selected === MODULE_MODAL.dao} onClose={onClose} />
      <DelayModuleModal
        open={selected === MODULE_MODAL.delay}
        onClose={onClose}
      />
    </>
  );
};
