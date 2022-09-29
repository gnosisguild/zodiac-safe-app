import { Grid, Link, makeStyles, Typography } from "@material-ui/core"
import { Dropdown } from "components/Dropdown"
import React from "react"
import { ARBITRATOR_OPTIONS } from "services"
import { InputPartProps } from "../.."

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
}))

export type Data = {
  arbitratorOption: ARBITRATOR_OPTIONS
}

export const OracleArbitration: React.FC<InputPartProps> = ({ data, setData }) => {
  const classes = useStyles()

  const set = (key: keyof Data) => (value: any) => setData({ ...data, [key]: value })

  const get = (key: keyof Data) => data[key]

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Arbitration
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              An arbitrator is responsible for providing a final answer to a question when there is a dispute, in
              exchange for a fee. In most cases, the bond escalation-game eliminates the need for this. However, if you
              feel it&apos;s necessary to include a backup arbitration strategy incase of a dispute, you can select one
              from below. Read more in the{` `}
              <Link
                underline="always"
                href="https://reality.eth.link/app/docs/html/arbitrators.html"
                target={"_blank"}
                color="inherit"
              >
                Reality.eth arbitrators documentation
              </Link>
              .
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Dropdown
          value={get("arbitratorOption")}
          options={[
            {
              label: "No arbitration (highest bond wins)",
              value: ARBITRATOR_OPTIONS.NO_ARBITRATOR,
            },
            { label: "Kleros", value: ARBITRATOR_OPTIONS.KLEROS },
          ]}
          disableUnderline
          label="Arbitrator:"
          onChange={({ target }) => set("arbitratorOption")(target.value)}
        />
      </Grid>
    </Grid>
  )
}

export default OracleArbitration
