import React from "react"
import { TellorModuleModal } from "./TellorModule/TellorModuleModal"
import { OptimisticGovernorModuleModal } from "./OptimisticGovernorModule/OptimisticGovernorModuleModal"
import { DelayModuleModal } from "./DelayModule/DelayModuleModal"
import { ModuleType } from "../../../store/modules/models"
import { CustomModuleModal } from "./CustomModule/CustomModuleModal"
import { AMBModuleModal } from "./AMBModuleModal/AMBModuleModal"
import { ExitModuleModal } from "./ExitModule/ExitModuleModal"
import { RolesV1ModifierModal } from "./RolesModifier/RolesV1ModifierModal"
import { RolesV2ModifierModal } from "./RolesModifier/RolesV2ModifierModal"
import { RealityModuleOldModal } from "./RealityModuleOld/RealityModuleOldModal"
import { KlerosRealityModuleModal } from "./KlerosRealityModule/KlerosRealityModuleModal"
import { ConnextModuleModal } from "./ConnextModule/ConnextModuleModal"

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
      <RolesV1ModifierModal
        open={selected === ModuleType.ROLES_V1}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.ROLES_V1)}
      />
      <RolesV2ModifierModal
        open={selected === ModuleType.ROLES_V2}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.ROLES_V2)}
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
      <ConnextModuleModal
        open={selected === ModuleType.CONNEXT}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.CONNEXT)}
      />

      <CustomModuleModal
        open={selected === ModuleType.UNKNOWN}
        onClose={onClose}
        onSubmit={() => onSubmit && onSubmit(ModuleType.UNKNOWN)}
      />
    </>
  )
}
