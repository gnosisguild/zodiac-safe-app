import React from "react"
import { AppLayout } from "./components/layout/AppLayout"
import Panel from "./views/Panel"
import { Views } from "./View"
import Header from "./views/Header"
import { makeStyles } from "@material-ui/core"
import TransactionBuilder from "./views/TransactionBuilder"
import zodiacBackground from "./assets/images/zodiac-bg.svg"

const useStyles = makeStyles((theme) => ({
  root: {
    background: `url(${zodiacBackground})`,
    backgroundSize: "cover",
  },
  background: {
    height: "100vh",
    padding: theme.spacing(3, 4, 4, 4),
    background:
      "linear-gradient(108.86deg, rgba(26, 33, 66, 0.85) 6.24%, rgba(12, 19, 8, 0.85) 53.08%, rgba(37, 6, 4, 0.85) 96.54%);",
  },
}))

const App: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.background}>
        <Header />
        <AppLayout left={<Panel />}>
          <Views />
        </AppLayout>
        <TransactionBuilder />
      </div>
    </div>
  )
}

export default App
