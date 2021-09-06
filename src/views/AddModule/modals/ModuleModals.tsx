import React from "react";
import { RealityModuleModal } from "./RealityModuleModal";
import { DelayModuleModal } from "./DelayModuleModal";
import { ModuleType } from "../../../store/modules/models";
import { CustomModuleModal } from "./CustomModuleModal";
import { AMBModuleModal } from "./AMBModuleModal";
import { ExitModuleModal } from "./ExitModuleModal";

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
      <RealityModuleModal
        open={selected === ModuleType.REALITY_ETH}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.REALITY_ETH)}
      />
      <DelayModuleModal
        open={selected === ModuleType.DELAY}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.DELAY)}
      />
      <AMBModuleModal
        open={selected === ModuleType.AMB}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.AMB)}
      />
      <ExitModuleModal
        open={selected === ModuleType.EXIT}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.EXIT)}
      />
      <CustomModuleModal
        open={selected === ModuleType.UNKNOWN}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.UNKNOWN)}
      />
    </>
  );
};
