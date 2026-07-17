import React, { useEffect, useState } from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

const NOTICE_URL = 'https://x.com/zodiaceco/status/2061862711206502902'
const ZODIAC_APP_ORIGIN = 'https://app.zodiac.eco'

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
 * Warns when the connected Safe has a Zodiac setup affected by the Roles v2 /
 * Delay v1.1.0 fallback-handler vulnerability, with a link to the remediation
 * tool. The banner only shows once the Zodiac app's security-check API
 * confirms the Safe is vulnerable; on errors or inconclusive results it stays
 * hidden.
 */
export const SecurityBanner: React.FC = () => {
  const classes = useStyles()
  const { safe } = useSafeAppsSDK()
  const [dismissed, setDismissed] = useState(false)
  const [affected, setAffected] = useState(false)

  useEffect(() => {
    if (!safe.safeAddress || !safe.chainId) return

    setAffected(false)
    const abortController = new AbortController()
    const checkUrl = `${ZODIAC_APP_ORIGIN}/public/api/security-check?safes=${encodeURIComponent(
      `${safe.chainId}:${safe.safeAddress}`,
    )}`
    fetch(checkUrl, { signal: abortController.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => setAffected(result?.status === 'affected'))
      .catch(() => {
        // inconclusive check — keep the banner hidden
      })

    return () => abortController.abort()
  }, [safe.chainId, safe.safeAddress])

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
