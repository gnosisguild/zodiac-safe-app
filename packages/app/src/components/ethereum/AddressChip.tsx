import React from 'react'
import { Chip, ChipProps, makeStyles } from '@material-ui/core'
import { HashInfo } from './HashInfo'
import { shortAddress } from '../../utils/string'

interface AddressChipProps extends ChipProps {
  address: string
  name?: string
}

const useStyles = makeStyles((theme) => ({
  name: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    '& img': {
      width: 20,
      height: 20,
    },
  },
}))

export const AddressChip: React.FC<AddressChipProps> = ({ address, name, ...props }) => {
  const classes = useStyles()
  const label = (
    <>
      {name ? <b className={classes.name}>{name}</b> : null}
      {shortAddress(address)}
    </>
  )
  return (
    <Chip
      {...props}
      avatar={
        <HashInfo
          showAvatar
          showHash={false}
          avatarSize='sm'
          hash={address}
          className={classes.avatar}
        />
      }
      label={label}
    />
  )
}
