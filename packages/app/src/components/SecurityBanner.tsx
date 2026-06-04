import React, { useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { useRootSelector } from '../store'
import { getModulesList } from '../store/modules/selectors'
import { Module, ModuleType } from '../store/modules/models'

const NOTICE_URL = 'https://x.com/zodiaceco/status/2061862711206502902'
const ZODIAC_APP_ORIGIN = 'https://app.zodiac.eco'

// Module types affected by the fallback-handler vulnerability. Roles Modifier v1
// is not affected.
const AFFECTED_TYPES = [ModuleType.ROLES_V2, ModuleType.DELAY]

const flatten = (modules: Module[]): Module[] =>
  modules.flatMap((module) => [module, ...flatten(module.subModules ?? [])])

const useStyles = makeStyles((theme) => ({
  banner: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2),
    background: '#fbbf24',
    color: '#451a03',
    borderRadius: 4,
    border: '1px solid rgba(69, 26, 3, 0.35)',
  },
  text: {
    flex: 1,
  },
  link: {
    color: '#451a03',
    fontWeight: 600,
    textDecoration: 'underline',
  },
  dismiss: {
    background: 'none',
    border: 'none',
    color: '#451a03',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
    padding: theme.spacing(0.5),
  },
}))

/**
 * Warns when the connected Safe has a Zodiac module affected by the Roles v2 /
 * Delay v1.1.0 fallback-handler vulnerability, with a link to the remediation
 * tool. Detected from the modules already loaded into the store — including
 * nested sub-modules — so no external call is needed. Roles Modifier v1 is
 * unaffected and never triggers the banner.
 */
export const SecurityBanner: React.FC = () => {
  const classes = useStyles()
  const { safe } = useSafeAppsSDK()
  const modules = useRootSelector(getModulesList)
  const [dismissed, setDismissed] = useState(false)

  const affected = flatten(modules).some((module) =>
    AFFECTED_TYPES.includes(module.type),
  )
  if (!affected || dismissed) return null

  const checkerUrl = `${ZODIAC_APP_ORIGIN}/public/fallback-handler?address=${safe.safeAddress}&chainId=${safe.chainId}`

  return (
    <div role='alert' className={classes.banner}>
      <Typography variant='body2' className={classes.text}>
        <strong>Security update:</strong> this Safe has a Zodiac Roles Modifier
        v2 and/or Delay Modifier affected by a known vulnerability in specific
        setups.{' '}
        <a
          href={checkerUrl}
          target='_blank'
          rel='noopener noreferrer'
          className={classes.link}
        >
          Review &amp; remediate
        </a>
        {' · '}
        <a
          href={NOTICE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className={classes.link}
        >
          Read the full notice
        </a>
      </Typography>
      <button
        type='button'
        aria-label='Dismiss'
        className={classes.dismiss}
        onClick={() => setDismissed(true)}
      >
        ✕
      </button>
    </div>
  )
}

export default SecurityBanner
