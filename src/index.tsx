import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MUIThemeProvider,
} from "@material-ui/core";
import { Loader, theme as gnosisTheme } from "@gnosis.pm/safe-react-components";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import GlobalStyle from "./GlobalStyle";
import App from "./App";
import MUIShadows from "@material-ui/core/styles/shadows";
import createPalette from "@material-ui/core/styles/createPalette";
import { Provider } from "react-redux";
import { REDUX_STORE } from "./store";
import { Row } from "./components/layout/Row";

const palette = createPalette({
  type: "dark",
  background: {
    default: "rgba(224, 197, 173, 0.1)",
    paper: "rgba(217, 212, 173, 0.1)",
  },
  text: {
    secondary: "rgb(104, 166, 0)",
  },
});

palette.primary = palette.augmentColor({
  "500": "#30312C",
});
palette.secondary = palette.augmentColor({
  "500": "#486A0F",
});

const shadows = MUIShadows;
shadows[1] = "0px 2px 4px rgba(105, 112, 117, 0.2)";
shadows[2] = "0px 4px 4px rgba(0, 0, 0, 0.25)";
shadows[3] = "0px 4px 10px rgba(105, 112, 117, 0.2)";

const muiTheme = createTheme({
  palette,
  shadows,
  typography: {
    fontFamily: "Spectral",
    h4: {
      fontSize: 24,
      fontWeight: "normal",
    },
    h5: {
      fontSize: 20,
      fontWeight: "normal",
    },
    h6: {
      fontSize: 14,
      fontWeight: "normal",
    },
    body2: {
      fontSize: 12,
    },
    subtitle1: {
      fontSize: 16,
      color: palette.primary.main,
    },
  },
  shape: {
    borderRadius: 6,
  },
  overrides: {
    MuiPaper: {
      root: {
        borderRadius: "0 !important",
        border: "1px solid",
        borderColor: "rgba(217, 212, 173, 0.3)",
        position: "relative",
        zIndex: 3,
        "&::before": {
          content: '" "',
          position: "absolute",
          zIndex: -1,
          top: "2px",
          left: "2px",
          right: "2px",
          bottom: "2px",
          border: "1px solid rgba(217, 212, 173, 0.3)",
        },
      },
    },
    MuiCssBaseline: {
      "@global": {
        body: {
          background:
            "linear-gradient(108.86deg, #000000 6.24%, #020060 96.54%);",
        },
      },
    },
    MuiTypography: {
      gutterBottom: { marginBottom: 8 },
    },
    MuiChip: {
      root: {
        padding: "4px 8px",
        height: "auto",
        backgroundColor: "rgba(217, 212, 173, 0.1)",
        border: "1px solid rgba(217, 212, 173, 0.3)",
      },
      avatar: {
        display: "contents !important",
      },
      label: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    MuiButton: {
      root: {
        lineHeight: 1.5,
        textTransform: "none",
        position: "relative",
        borderRadius: 0,
        "&::before": {
          content: '" "',
          position: "absolute",
          zIndex: 1,
          top: "2px",
          left: "2px",
          right: "2px",
          bottom: "2px",
          border: "1px solid rgba(217, 212, 173, 0.3)",
        },
      },
      contained: {
        boxShadow: "none",
        border: "1px solid rgba(217, 212, 173, 0.3);",
      },
      containedSizeSmall: {
        padding: "4px 8px",
      },
    },
    MuiInputBase: {
      root: {
        padding: "8px 0 8px 8px",
        border: "1px solid rgb(255,255,255)",
        borderRadius: 4,
      },
      input: {
        padding: 0,
      },
    },
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
            <Row
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Loader size="md" />
            </Row>
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
