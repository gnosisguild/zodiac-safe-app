import React from 'react'
import { makeStyles } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'
import classNames from 'classnames'
import { Column } from '../../../components/layout/Column'

export interface PanelItemProps {
  active?: boolean
  sub?: boolean
  image?: React.ReactElement | null
  children: React.ReactNode
  onClick?(e: React.MouseEvent): void
}

export const PANEL_ITEM_CONTENT_HEIGHT = 56
export const PANEL_ITEM_PADDING = 8
export const PANEL_ITEM_HEIGHT = PANEL_ITEM_CONTENT_HEIGHT + PANEL_ITEM_PADDING * 2 + 2
export const PANEL_ITEM_MARGIN = 12

const useStyles = makeStyles((theme) => ({
  root: {
    padding: PANEL_ITEM_PADDING,
    transition: '0.2s ease all',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(217, 212, 173, 0.15)',
    },
  },
  active: {
    borderColor: theme.palette.common.white,
    background: 'none',
    cursor: 'initial',
    '&::before': {
      borderColor: theme.palette.common.white,
    },
    '&:hover': {
      background: 'none',
    },
  },
  spacing: {
    '& + &, &.sub': {
      marginTop: PANEL_ITEM_MARGIN,
    },
  },
  moduleItem: {
    display: 'grid',
    gridTemplateColumns: '48px 1fr',
    gridGap: theme.spacing(2),

    backgroundColor: 'transparent',

    '&.sub': {
      zIndex: 2,
    },
  },
  content: {
    width: '100%',
    justifyContent: 'center',
  },
  image: {
    paddingTop: 2,
  },
}))

export const PanelItem: React.FC<PanelItemProps> = ({
  active,
  sub,
  image = null,
  children,
  onClick,
}) => {
  const classes = useStyles()
  return (
    <ZodiacPaper
      borderStyle='double'
      className={classNames(classes.root, classes.spacing, {
        sub,
        [classes.active]: active,
      })}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div
        onClick={active ? undefined : onClick}
        className={classNames(classes.moduleItem, {
          active,
          sub,
        })}
      >
        <div className={classes.image}>{image}</div>
        <Column className={classes.content}>{children}</Column>
      </div>
    </ZodiacPaper>
  )
}
