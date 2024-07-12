import React from 'react'
import { LoadingIcon } from './LoadingIcon'
import { ReactComponent as TrashIcon } from '../../assets/icons/delete-icon.svg'
import { ReactComponent as RemoveStateIcon } from '../../assets/images/remove-pending-state.svg'

interface RemoveIconProps {
  instant?: boolean
}

export const RemoveIcon: React.FC<RemoveIconProps> = ({ instant = false }) => {
  if (instant) return <LoadingIcon icon={<TrashIcon />} />
  return <RemoveStateIcon />
}
