import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@material-ui/core'
import { Loader } from '@gnosis.pm/safe-react-components'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import App from './App'
import { Provider } from 'react-redux'
import { REDUX_STORE } from './store'
import { Row } from './components/layout/Row'
import { zodiacMuiTheme, gnosisStyledComponentsTheme } from 'zodiac-ui-components'

const Main = () => {
  return (
    <MUIThemeProvider theme={zodiacMuiTheme}>
      <ThemeProvider theme={gnosisStyledComponentsTheme}>
        <CssBaseline />
        <SafeProvider
          loader={
            <Row
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Loader size='md' />
            </Row>
          }
        >
          <Provider store={REDUX_STORE}>
            <App />
          </Provider>
        </SafeProvider>
      </ThemeProvider>
    </MUIThemeProvider>
  )
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container missing in index.html')
}

const root = ReactDOM.createRoot(container)

root.render(
  <React.Fragment>
    <Main />
  </React.Fragment>,
)
