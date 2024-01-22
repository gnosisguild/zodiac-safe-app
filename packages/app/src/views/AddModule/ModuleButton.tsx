import React from "react"
import { makeStyles, Typography } from "@material-ui/core"
import { BadgeIcon, colors, ZodiacPaper } from "zodiac-ui-components"
import { BadgeIconProps } from "zodiac-ui-components/lib/components/Icons/BadgeIcon/BadgeIcon"
import classNames from "classnames"
import { Tag } from "components/text/Tag"

interface ModuleButtonProps extends BadgeIconProps {
  title: string
  description: string
  deprecated?: boolean
  className?: string

  onClick(): void
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    padding: theme.spacing(2),
    transition: "0.2s ease all",
    "&:hover": {
      background: "rgba(217, 212, 173, 0.15)",
    },
  },
  badgeIcon: {
    background: colors.sepia[100],
    marginBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(0.5),
  },
  deprecated: {
    opacity: 0.7,
  },
}))

export const ModuleButton = ({
  title,
  description,
  icon,
  deprecated,
  className,
  onClick,
}: ModuleButtonProps) => {
  const classes = useStyles()

  return (
    <ZodiacPaper
      borderStyle="double"
      className={classNames(classes.root, className, {
        [classes.deprecated]: deprecated,
      })}
      onClick={onClick}
    >
      <BadgeIcon icon={icon} size={60} className={classes.badgeIcon} />
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {deprecated && <Tag>Deprecated</Tag>}
      <Typography variant="body2" align="center">
        {description}
      </Typography>
    </ZodiacPaper>
  )
}
