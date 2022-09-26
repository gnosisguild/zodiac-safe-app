import { Grid, makeStyles, Typography } from "@material-ui/core"
import React, { useState } from "react"

import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined"
import { ZodiacModal } from "zodiac-ui-components"
import { ProposalDetailsModal } from "./ProposalDetailsModal"

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: 12,
    color: "rgba(244, 67, 54, 1)",
  },
  messageDetails: {
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
  },

  errorIcon: {
    fill: "rgba(244, 67, 54, 1)",
    width: "20px",
  },
  detailsContainer: {
    width: "95%",
  },
  messageContainer: {
    width: "85%",
  },
}))

export interface ProposalStatusProps {
  status: "error" | "warning" | null
  message: string | null
  type: "controller" | "owner" | "snapshot" | "safesnap"
  address?: string
}

export const ProposalStatus: React.FC<ProposalStatusProps> = ({ status, message, type, address }) => {
  const classes = useStyles()
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleTitle = (): string => {
    switch (type) {
      case "controller":
        return "Safe not controller of ENS"

      case "owner":
        return "Security Risk Detected"

      case "snapshot":
        return "Snapshot space not found"

      case "safesnap":
        return "Safesnap plugin is already installed"

      default:
        return ""
    }
  }

  const title = handleTitle()
  return (
    status && (
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          {status === "error" && <ErrorOutlineIcon className={classes.errorIcon} />}
          {status === "warning" && <WarningOutlinedIcon className={classes.errorIcon} />}
        </Grid>
        <Grid item className={classes.detailsContainer}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item className={classes.messageContainer}>
              <Typography className={classes.message}>{message}</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.messageDetails} onClick={() => setShowModal(!showModal)}>
                Details
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <ZodiacModal
          open={showModal}
          isOpen={showModal}
          onClose={() => setShowModal(!showModal)}
          children={<ProposalDetailsModal title={title} type={type} address={address} />}
        />
      </Grid>
    )
  )
}
