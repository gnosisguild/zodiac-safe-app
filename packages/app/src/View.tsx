import ModuleDetails from './views/ModuleDetails'
import React from 'react'
import { useRootSelector } from './store'
import { getCurrentModule, getCurrentPendingModule } from './store/modules/selectors'
import AddModules from './views/AddModule'
import { ModulePendingTransaction } from './views/ModuleDetails/ModulePendingTransaction'
import RealityModule from 'views/AddModule/wizards/RealityModule'
import { OzGovernorModule } from 'views/AddModule/wizards/OzGovernor'

export const Views: React.FC = () => {
  const currentModule = useRootSelector(getCurrentModule)
  const currentPendingModule = useRootSelector(getCurrentPendingModule)
  const loadingModules = useRootSelector((state) => state.modules.loadingModules)
  const showRealityModule = useRootSelector((state) => state.modules.realityModuleScreen)
  const showOzGovernorModule = useRootSelector((state) => state.modules.OzGovernorModuleScreen)
  if (currentModule) {
    return <ModuleDetails module={currentModule} />
  }

  if (currentPendingModule) {
    return <ModulePendingTransaction />
  }

  if (showRealityModule) {
    return <RealityModule />
  }

  if (showOzGovernorModule) {
    return <OzGovernorModule />
  }

  if (!loadingModules) {
    return <AddModules />
  }

  return null
}
