import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import {
  createMuiTheme,
  CssBaseline,
  ThemeProvider as MUIThemeProvider,
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
import MUIShadows from "@material-ui/core/styles/shadows";
import createPalette from "@material-ui/core/styles/createPalette";
import { Provider } from "react-redux";
import { REDUX_STORE } from "./store";

const palette = createPalette({
  type: "light",
  primary: grey,
  background: {
    default: "#F8FAFB",
    paper: "#FFFFFF",
  },
});

palette.secondary = palette.augmentColor({
  "500": gnosisTheme.colors.primary,
});

const shadows = MUIShadows;
shadows[1] = "0px 2px 4px rgba(105, 112, 117, 0.2)";

const muiTheme = createMuiTheme({
  palette,
  shadows,
  typography: {
    fontFamily: gnosisTheme.fonts.fontFamily,
    h4: {
      fontSize: 24,
      fontWeight: "bold",
    },
    h6: {
      fontSize: 14,
      fontWeight: "bold",
    },
    subtitle1: {
      fontSize: 16,
      color: palette.primary.main,
    },
  },
  shape: {
    borderRadius: 6,
  },
});

const Main = () => {
  return (
    <MUIThemeProvider theme={muiTheme}>
      <ThemeProvider theme={gnosisTheme}>
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
          <Provider store={REDUX_STORE}>
            <App />
          </Provider>
        </SafeProvider>
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
