import React from "react";
import { DaoModuleModal } from "./DaoModuleModal";
import { DelayModuleModal } from "./DelayModuleModal";
import { ModuleType } from "../../../store/modules/models";

interface ModuleModalsProps {
  selected?: ModuleType;
  onClose?(): void;
  onSubmit?(module: ModuleType): void;
}

export const ModuleModals = ({
  selected,
  onClose,
  onSubmit,
}: ModuleModalsProps) => {
  return (
    <>
      <DaoModuleModal
        open={selected === ModuleType.DAO}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.DAO)}
      />
      <DelayModuleModal
        open={selected === ModuleType.DELAY}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.DELAY)}
      />
    </>
  );
};
