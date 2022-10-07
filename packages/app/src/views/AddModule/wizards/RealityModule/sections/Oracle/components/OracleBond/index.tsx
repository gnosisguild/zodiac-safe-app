import { Grid, Link, makeStyles, Typography } from "@material-ui/core"
import React from "react"
import { ZodiacTextField, colors } from "zodiac-ui-components"
import { InputPartProps } from "../.."
import { OracleAlert } from "../OracleAlert"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
  input: {
    "& .MuiInputBase-root": {
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
  error: {
    "& .MuiInputBase-root": {
      borderColor: "rgba(244, 67, 54, 0.3)",
      background: "rgba(244, 67, 54, 0.1)",
      "&::before": {
        borderColor: "rgba(244, 67, 54, 0.3)",
      },
    },
  },
}))

export const MIN_BOND = 0.1

export type Data = {
  bond: number
}

export const OracleBond: React.FC<InputPartProps> = ({ data, setData }) => {
  const classes = useStyles()

  const set = (key: keyof Data) => (value: any) => setData({ ...data, [key]: value })

  const get = (key: keyof Data) => data[key]

  const bond = get("bond")

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1} className={classes.container}>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Bond
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              Minimum bond required for an answer to be accepted. New answers must be
              submitted with double the previous bond. For more on why a bond is required
              in an escalation-game-based oracle, read more in the{" "}
              <Link
                underline="always"
                href="http://reality.eth.link/app/docs/html/whitepaper.html"
                target={"_blank"}
                color="inherit"
              >
                Reality.eth whitepaper.
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <ZodiacTextField
          label="Bond"
          color="secondary"
          borderStyle="double"
          className={bond < MIN_BOND ? classes.error : classes.input}
          prefix="ETH"
          value={bond}
          onChange={(e) => set("bond")(e.target.value)}
        />
      </Grid>
      {bond < MIN_BOND && (
        <Grid item>
          <OracleAlert
            type="warning"
            message="We highly recommend that your bond exceeds 0.1 ETH."
          />
        </Grid>
      )}
    </Grid>
  )
}

export default OracleBond
