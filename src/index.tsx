import React, { useCallback, useEffect, useState } from "react";
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
import MUIShadows from "@material-ui/core/styles/shadows";
import createPalette from "@material-ui/core/styles/createPalette";

export const DarkModeContext = React.createContext({ toggleDarkMode() {} });

const Main = () => {
  const isDarkModePreferred = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = useCallback(
    () => setDarkMode(!isDarkMode),
    [isDarkMode]
  );

  useEffect(() => {
    setDarkMode(isDarkModePreferred);
  }, [isDarkModePreferred]);

  const muiTheme = React.useMemo(() => {
    const palette = createPalette({
      type: isDarkMode ? "dark" : "light",
      primary: grey,
      background: {
        default: isDarkMode ? "#383E42" : "#F8FAFB",
        paper: isDarkMode ? "#2E3438" : "#FFFFFF",
      },
    });
    palette.secondary = palette.augmentColor({
      "500": gnosisTheme.colors.primary,
    });
    const shadows = MUIShadows;
    shadows[1] = "0px 2px 4px rgba(105, 112, 117, 0.2)";

    return createMuiTheme({
      palette,
      typography: { fontFamily: gnosisTheme.fonts.fontFamily },
      shape: {
        borderRadius: 6,
      },
      shadows,
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
