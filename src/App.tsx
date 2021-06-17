import React from "react";
import { AppLayout } from "./views/AppLayout";
import { Testing } from "Testing";
import { useModulesState } from "./contexts/modules";
import { Box } from "@material-ui/core";
import { ModuleDetails } from "./views/ModuleDetails/ModuleDetails";

const App: React.FC = () => {
  const modulesState = useModulesState();

  return (
    <AppLayout>
      {modulesState.current ? (
        <ModuleDetails module={modulesState.current} />
      ) : null}
      <Box padding={2}>
        <Testing />
      </Box>
    </AppLayout>
  );
};

export default App;
