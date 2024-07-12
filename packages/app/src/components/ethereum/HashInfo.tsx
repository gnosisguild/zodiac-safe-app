import { EthHashInfo } from "@gnosis.pm/safe-react-components"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => {
  return {
    hashInfo: {
      display: "inline-flex !important",
      width: 50,
      height: 50,
      padding: theme.spacing(0.5),
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: "50%",
      borderColor: "rgba(255, 255, 255, 0.2)",
      background: "rgba(224, 197, 173, 0.1)",

      "& p": {
        fontSize: 12,
        color: theme.palette.text.primary + " !important",
      },
      "& .jLVlPg": {
        margin: 0,
      },
      "& .jLVlPg > p": {
        fontWeight: "bold",
        fontSize: 14,
      },
    },
  }
})

export const HashInfo = (props: Parameters<typeof EthHashInfo>[0]) => {
  const classes = useStyles()
  return <EthHashInfo className={classes.hashInfo} {...props} />
}
