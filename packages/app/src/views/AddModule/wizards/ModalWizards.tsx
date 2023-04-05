import React from "react"
import { TellorModuleModal } from "./TellorModule/TellorModuleModal"
import { OptimisticGovernorModuleModal } from "./OptimisticGovernorModule/OptimisticGovernorModuleModal"
import { DelayModuleModal } from "./DelayModule/DelayModuleModal"
import { ModuleType } from "../../../store/modules/models"
import { CustomModuleModal } from "./CustomModule/CustomModuleModal"
import { AMBModuleModal } from "./AMBModuleModal/AMBModuleModal"
import { ExitModuleModal } from "./ExitModule/ExitModuleModal"
import { RolesModifierModal } from "./RolesModifier/RolesModifierModal"
import { RealityModuleOldModal } from "./RealityModuleOld/RealityModuleOldModal"
import { KlerosRealityModuleModal } from "./KlerosRealityModule/KlerosRealityModuleModal"

/**
 * All wizards that use a Modal must be added here.
 */

interface ModuleModalsProps {
  selected?: ModuleType

  onClose?(): void

  onSubmit?(module: ModuleType): void
}

export const ModuleModals = ({ selected, onClose, onSubmit }: ModuleModalsProps) => {
  return (
    <>
      <TellorModuleModal
        open={selected === ModuleType.TELLOR}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.TELLOR)}
      />
      <OptimisticGovernorModuleModal
        open={selected === ModuleType.OPTIMISTIC_GOVERNOR}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.OPTIMISTIC_GOVERNOR)}
      />
      <DelayModuleModal
        open={selected === ModuleType.DELAY}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.DELAY)}
      />
      <AMBModuleModal
        open={selected === ModuleType.BRIDGE}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.BRIDGE)}
      />
      <ExitModuleModal
        open={selected === ModuleType.EXIT}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.EXIT)}
      />
      <RolesModifierModal
        open={selected === ModuleType.ROLES}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.DELAY)}
      />
      <RealityModuleOldModal
        open={selected === ModuleType.REALITY_ETH}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.REALITY_ETH)}
      />
      <KlerosRealityModuleModal
        open={selected === ModuleType.KLEROS_REALITY}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.KLEROS_REALITY)}
      />

      <CustomModuleModal
        open={selected === ModuleType.UNKNOWN}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.UNKNOWN)}
      />
    </>
  )
}
