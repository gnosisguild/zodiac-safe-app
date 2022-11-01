import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { Link, makeStyles, Typography } from "@material-ui/core"
import { Address } from "components/ethereum/Address"
import { Row } from "components/layout/Row"

import React from "react"
import { Module } from "store/modules/models"
import { PanelItemProps } from "./PanelItem"
import { rolesAppUrl } from "utils/url"

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
  const { safe: safeInfo } = useSafeAppsSDK()
  const rolesAddress = module.address

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
          onClick={() => {
            window.location.href = rolesAppUrl(safeInfo, rolesAddress)
          }}
          underline="always"
        >
          Edit Roles
        </Link>
      </Row>
    </div>
  )
}
