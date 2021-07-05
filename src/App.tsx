import React from "react";
import { AppLayout } from "./views/AppLayout";
import { useModulesSelector } from "./contexts/modules";
import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";

const App: React.FC = () => {
  const currentModule = useModulesSelector((state) => state.current);

  return (
    <AppLayout>
      <ModuleDetails module={currentModule} />
    </AppLayout>
  );
};

export default App;
