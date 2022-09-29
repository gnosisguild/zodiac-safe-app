import React from "react"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import { ZodiacPaper } from "zodiac-ui-components"
import { Link } from "components/text/Link"

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: "white",
    width: "20px",
  },
  paperContainer: {
    padding: theme.spacing(2),
    background: "rgba(244, 67, 54, 0.1)",
    border: "1px solid rgba(244, 67, 54, 0.3)",
    "&, &:before, &:after": {
      border: "1px solid rgba(244, 67, 54, 0.3)",
    },
  },
  addressPaperContainer: {
    width: "100%",
    padding: theme.spacing(1),
    background: "rgba(0, 0, 0, 0.2)",
    border: 0,
    borderRadius: 4,
    display: "inline-block",
    "& .MuiTypography-root": {
      fontFamily: "Roboto Mono",
    },
  },
}))

export interface ProposalDetailsModalProps {
  title: string
  type: "controller" | "owner" | "snapshot" | "safesnap"
  address?: string
}

export const ProposalDetailsModal: React.FC<ProposalDetailsModalProps> = ({ title, type, address }) => {
  const classes = useStyles()

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <ErrorOutlineIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="h4">{title}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography>
          {type === "controller" &&
            "The safe you are currently using with Zodiac is not the controller of the ENS you've entered. Try one of the following: "}
          {type === "owner" &&
            "The ENS that you've entered is not owned by a safe. This gives unilateral control to the individual with this address: "}
          {type === "safesnap" && "The Snapshot space has already installed the Safesnap plugin."}
          {type === "snapshot" &&
            "The ENS you've entered is not setup with a Snapshot space. To setup a snapshot space with this ENS, follow the guide"}

          {type === "snapshot" && (
            <>
              {" "}
              <Link underline="always" href="https://docs.snapshot.org/spaces/create" target={"_blank"} color="inherit">
                here.
              </Link>
            </>
          )}
        </Typography>
      </Grid>
      {address && (
        <Grid item>
          <ZodiacPaper borderStyle="double" className={classes.paperContainer}>
            <ZodiacPaper borderStyle="single" className={classes.addressPaperContainer}>
              <Typography variant="body2">{address}</Typography>
            </ZodiacPaper>
          </ZodiacPaper>
        </Grid>
      )}
      {["controller", "owner"].includes(type) && (
        <Grid item>
          <Typography>
            {type === "controller" && "- Check that your ENS is typed correctly."}
            {type === "owner" && "We highly recommend transferring the ENS to a multisig safe before continuing."}
          </Typography>
        </Grid>
      )}

      {type === "controller" && (
        <Grid item>
          <Typography>
            - Update your ENS controller settings via the{" "}
            <Link
              underline="always"
              href="https://docs.ens.domains/contract-api-reference/.eth-permanent-registrar/controller"
              target={"_blank"}
              color="inherit"
            >
              ENS.
            </Link>
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default ProposalDetailsModal
