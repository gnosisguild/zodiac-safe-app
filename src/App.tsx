import React from "react";
import { AppLayout } from "./views/AppLayout";
import { useModulesState } from "./contexts/modules";
import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";

const App: React.FC = () => {
  const modulesState = useModulesState();

  return (
    <AppLayout>
      <ModuleDetails module={modulesState.current} />
    </AppLayout>
  );
};

export default App;
