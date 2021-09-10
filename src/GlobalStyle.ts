import { createGlobalStyle } from "styled-components";
import avertaFont from "@gnosis.pm/safe-react-components/dist/fonts/averta-normal.woff2";
import avertaBoldFont from "@gnosis.pm/safe-react-components/dist/fonts/averta-bold.woff2";
import MonacoFont from "./assets/fonts/Monaco.woff";

import Roboto100Woff2 from "./assets/fonts/Roboto/roboto-v27-latin-100.woff2";
import Roboto300Woff2 from "./assets/fonts/Roboto/roboto-v27-latin-300.woff2";
import RobotoRegularWoff2 from "./assets/fonts/Roboto/roboto-v27-latin-regular.woff2";
import Roboto500Woff2 from "./assets/fonts/Roboto/roboto-v27-latin-500.woff2";
import Roboto700Woff2 from "./assets/fonts/Roboto/roboto-v27-latin-700.woff2";
import Roboto900Woff2 from "./assets/fonts/Roboto/roboto-v27-latin-900.woff2";

import Roboto100Woff from "./assets/fonts/Roboto/roboto-v27-latin-100.woff";
import Roboto300Woff from "./assets/fonts/Roboto/roboto-v27-latin-300.woff";
import RobotoRegularWoff from "./assets/fonts/Roboto/roboto-v27-latin-regular.woff";
import Roboto500Woff from "./assets/fonts/Roboto/roboto-v27-latin-500.woff";
import Roboto700Woff from "./assets/fonts/Roboto/roboto-v27-latin-700.woff";
import Roboto900Woff from "./assets/fonts/Roboto/roboto-v27-latin-900.woff";

import RobotoMonoRegularWoff from "./assets/fonts/RobotoMono/roboto-mono-v13-latin-regular.woff2";
import RobotoMonoRegularWoff2 from "./assets/fonts/RobotoMono/roboto-mono-v13-latin-regular.woff";

import SpectralRegularWoff from "./assets/fonts/Spectral/spectral-v7-latin-regular.woff";
import SpectralRegularWoff2 from "./assets/fonts/Spectral/spectral-v7-latin-regular.woff2";

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%
    }

    body {
       height: 100%;
       margin: 0px;
       padding: 0px;
    }

    #root {
        height: 100%;
    }

    .MuiFormControl-root,
    .MuiInputBase-root {
        width: 100% !important;
    }

    @font-face {
        font-family: 'Averta';
        src: local('Averta'), local('Averta Bold'),
        url(${avertaFont}) format('woff2'),
        url(${avertaBoldFont}) format('woff');
    }

    /* roboto-100 - latin */
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 100;
      src: local(''),
      url(${Roboto100Woff2}) format('woff2'),
      url(${Roboto100Woff}) format('woff');
    }
    /* roboto-300 - latin */
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 300;
      src: local(''),
      url(${Roboto300Woff2}) format('woff2'),
      url(${Roboto300Woff}) format('woff');
    }
    /* roboto-regular - latin */
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: local(''),
      url(${RobotoRegularWoff2}) format('woff2'),
      url(${RobotoRegularWoff}) format('woff');
    }
    /* roboto-500 - latin */
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      src: local(''),
      url(${Roboto500Woff2}) format('woff2'),
      url(${Roboto500Woff}) format('woff');
    }
    /* roboto-700 - latin */
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 700;
      src: local(''),
      url(${Roboto700Woff2}) format('woff2'),
      url(${Roboto700Woff}) format('woff');
    }
    /* roboto-900 - latin */
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 900;
      src: local(''),
      url(${Roboto900Woff2}) format('woff2'),
      url(${Roboto900Woff}) format('woff');
    }
    
    @font-face {
      font-family: 'Roboto Mono';
      font-style: normal;
      font-weight: 400;
      src: local(''),
      url(${RobotoMonoRegularWoff}) format('woff2'),
      url(${RobotoMonoRegularWoff2}) format('woff');
    }
    

    @font-face {
        font-family: 'Monaco';
        src: local('Monaco'), url(${MonacoFont}) format('woff');
    }

    /* spectral-regular - latin */
    @font-face {
      font-family: 'Spectral';
      font-style: normal;
      font-weight: 400;
      src: local(''),
      url(${SpectralRegularWoff2}) format('woff2'),
      url(${SpectralRegularWoff}) format('woff');
    }
`;

export default GlobalStyle;
