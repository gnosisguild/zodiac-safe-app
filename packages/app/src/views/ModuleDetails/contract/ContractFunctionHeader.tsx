import React from 'react'
import { Address } from '../../../components/ethereum/Address'
import { makeStyles, Typography } from '@material-ui/core'
import TimeAgo from 'timeago-react'
import { Skeleton } from '@material-ui/lab'
import { FunctionOutputs } from '../../../hooks/useContractQuery'
import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'
import { formatValue } from '../../../utils/contracts'
import classNames from 'classnames'
import { FunctionFragment } from 'ethers'

interface ContractFunctionHeaderProps {
  date?: Date
  func: FunctionFragment
  loading?: boolean
  showResult?: boolean
  result?: FunctionOutputs
}

const useStyles = makeStyles((theme) => ({
  spaceLeft: {
    marginLeft: theme.spacing(1),
  },
  type: {
    fontFamily: 'Roboto Mono',
    fontSize: '.75rem',
  },
  queryType: {
    fontSize: '.75rem',
  },
}))

export const ContractFunctionHeader: React.FC<ContractFunctionHeaderProps> = ({
  date,
  func,
  result,
  showResult,
  loading = false,
}) => {
  const classes = useStyles()

  if (loading) {
    return <Skeleton variant='text' width={300} />
  }

  if (showResult && result?.toString() && func.outputs) {
    const { baseType, type } = func.outputs[0]

    const value = formatValue(baseType, result)

    if (baseType === 'address') {
      return <Address address={value} TypographyProps={{ classes: { root: classes.type } }} />
    }
    return (
      <>
        <Typography variant='subtitle1' className={classes.type}>
          ({type})
        </Typography>
        <Typography noWrap className={classNames(classes.spaceLeft, classes.type)}>
          {value}
        </Typography>
        <CopyToClipboardBtn textToCopy={value} className={classes.spaceLeft} />
      </>
    )
  }

  if (date) {
    return (
      <Typography className={classes.queryType}>
        Queried <TimeAgo datetime={date} />
      </Typography>
    )
  }

  return <Typography className={classes.queryType}>Query</Typography>
}
