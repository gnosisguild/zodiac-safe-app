import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import {
  createMuiTheme,
  CssBaseline,
  ThemeProvider as MUIThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import {
  Loader,
  theme as gnosisTheme,
  Title,
} from "@gnosis.pm/safe-react-components";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import GlobalStyle from "./GlobalStyle";
import App from "./App";
import { grey } from "@material-ui/core/colors";
import { ModulesProvider } from "./contexts/modules";
import createPalette from "@material-ui/core/styles/createPalette";

export const DarkModeContext = React.createContext({ toggleDarkMode() {} });

const Main = () => {
  const [isDarkMode, setDarkMode] = useState(
    useMediaQuery("(prefers-color-scheme: dark)")
  );

  const toggleDarkMode = useCallback(
    () => setDarkMode(!isDarkMode),
    [isDarkMode]
  );

  const muiTheme = React.useMemo(() => {
    const palette = createPalette({
      type: isDarkMode ? "dark" : "light",
      primary: grey,
      background: {
        default: isDarkMode ? "#2E3438" : "#FFFFFF",
        paper: isDarkMode ? "#383E42" : "#F8FAFB",
      },
    });
    palette.secondary = palette.augmentColor({
      "500": gnosisTheme.colors.primary,
    });
    return createMuiTheme({
      palette,
    });
  }, [isDarkMode]);

  return (
    <MUIThemeProvider theme={muiTheme}>
      <ThemeProvider theme={gnosisTheme}>
        <DarkModeContext.Provider value={{ toggleDarkMode }}>
          <CssBaseline />
          <GlobalStyle />
          <SafeProvider
            loader={
              <>
                <Title size="md">Waiting for Safe...</Title>
                <Loader size="md" />
              </>
            }
          >
            <ModulesProvider>
              <App />
            </ModulesProvider>
          </SafeProvider>
        </DarkModeContext.Provider>
      </ThemeProvider>
    </MUIThemeProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
