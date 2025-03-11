import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import { Dropdown } from "components/Dropdown"
import React, { useEffect, useState } from "react"
import { colors, ZodiacTextField } from "zodiac-ui-components"
import { InputPartProps, ORACLE_MAINNET_OPTIONS, ORACLE_SEPOLIA_OPTIONS } from "../.."

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
      padding: "9px 8px",
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
}))

export type Data = {
  instanceAddress: string
  instanceType: "ETH" | "GNO" | "custom"
}

export const OracleInstance: React.FC<InputPartProps> = ({ data, setData }) => {
  const classes = useStyles()
  const { safe } = useSafeAppsSDK()
  const options = safe.chainId === 1 ? ORACLE_MAINNET_OPTIONS : ORACLE_SEPOLIA_OPTIONS
  const [selectedOracle, setSelectedOracle] = useState<string>("")

  useEffect(() => {
    if (data && options.length && selectedOracle === "") {
      const item = options.filter((element) =>
        element.label.includes(data.instanceAddress),
      )
      setSelectedOracle(item[0].value)
    }
  }, [data, options, selectedOracle])

  const set = (key: keyof Data) => (value: any) => setData({ ...data, [key]: value })

  const get = (key: keyof Data) => data[key]

  const handleInstance = (instance: string) => {
    if (instance === "custom") {
      set("instanceType")(instance)
      return
    }
    const address = instance.substr(instance.indexOf("-") + 1)
    const instanceType = instance.substr(0, instance.indexOf("-"))
    setSelectedOracle(instance)
    set("instanceAddress")(address)
    set("instanceType")(instanceType as string)
  }

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Oracle Instance
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              The oracle instance sets the appropriate bond token. It&apos;s recommended
              to use the default (ETH) oracle instance unless you have a specific reason
              to use something like a native token which can potentially be more prone to
              price manipulation.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Dropdown
          value={selectedOracle}
          options={options}
          disableUnderline
          label="Select oracle:"
          onChange={({ target }) => {
            handleInstance(target.value as string)
          }}
        />
      </Grid>
      {get("instanceType") === "custom" && (
        <Grid item>
          <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
            <Grid item sm={10}>
              <ZodiacTextField
                label="Contract Address"
                value={get("instanceAddress")}
                borderStyle="double"
                className={classes.input}
                onChange={(evt) => set("instanceAddress")(evt.target.value as string)}
              />
            </Grid>
            <Grid item sm={2}>
              {/* //TODO: get the bond token name from the contract} */}
              <Typography style={{ marginTop: 15 }}>WEENUS</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default OracleInstance
