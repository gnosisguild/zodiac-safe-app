import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { Link, makeStyles, Typography } from "@material-ui/core"
import { Address } from "components/ethereum/Address"
import { Row } from "components/layout/Row"

import React from "react"
import { Module } from "store/modules/models"
import { NETWORK, NETWORKS } from "utils/networks"
import { PanelItemProps } from "./PanelItem"

interface RoleModuleItemProps extends PanelItemProps {
  module: Module
  chainId: number
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(0.25),
    "& > *": {
      gridColumn: 1,
    },
  },
  text: {
    lineHeight: 1,
    letterSpacing: 1,
  },
  moduleName: {
    textTransform: "uppercase",
  },
  address: {
    fontFamily: "Roboto Mono",
  },
  link: {
    marginLeft: theme.spacing(1),
    lineHeight: 1,
    cursor: "pointer",
    textUnderlineOffset: "2px",
    "&:hover": {
      opacity: 0.5,
    },
  },
}))

export const RoleModuleItem: React.FC<RoleModuleItemProps> = ({ module }) => {
  const classes = useStyles()
  const { safe } = useSafeAppsSDK()

  // https://gnosis-safe.io/app/gor:0x69D196E3498EBC1752647dC05A6D12adb91472e8/apps?appUrl=https://localhost:3001/
  const handleClick = () => {
    const chainId = safe.chainId as number
    const currentChainShortName = NETWORKS[chainId as NETWORK].shortName
    const prevUrl = window.location.ancestorOrigins[0]
    console.log(prevUrl)
    if (prevUrl) {
      const newUrl = `${prevUrl}/app/${currentChainShortName}:${safe.safeAddress}/apps?appUrl=https://roles.gnosisguild.org/%23/${currentChainShortName}:${module.owner}`
      window.open(newUrl, "_blank")
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.moduleName}>
        {module.name}
      </Typography>

      <Row style={{ justifyContent: "space-between" }}>
        <Address
          short
          showOnHover
          address={module.address}
          TypographyProps={{
            variant: "body2",
            className: classes.address,
          }}
        />
        <Link
          color="textPrimary"
          noWrap
          className={classes.link}
          onClick={handleClick}
          underline="always"
        >
          Open Roles App
        </Link>
      </Row>
    </div>
  )
}
