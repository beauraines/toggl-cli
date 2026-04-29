import dotenv from 'dotenv'
import togglClient from 'toggl-client'
import chalk from 'chalk'
import { readConfig } from './config.js'
dotenv.config({quiet:true})
import debugClient from 'debug'
const debug = debugClient('toggl-cli-client')

const QUOTA_WARNING_THRESHOLD = 5

const NETWORK_ERROR_CODES = new Set([
  'ENOTFOUND',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENETUNREACH',
  'ECONNRESET',
  'EAI_AGAIN',
  'EHOSTUNREACH',
])

const NETWORK_ERROR_MESSAGES = {
  ENOTFOUND: 'Unable to resolve host — are you connected to the internet?',
  ECONNREFUSED: 'Connection refused by the server.',
  ETIMEDOUT: 'Connection timed out — the server may be unreachable.',
  ENETUNREACH: 'Network is unreachable — check your internet connection.',
  ECONNRESET: 'Connection was reset — please try again.',
  EAI_AGAIN: 'DNS lookup failed — check your internet connection and try again.',
  EHOSTUNREACH: 'Host is unreachable — check your internet connection.',
}

/**
 * Strips sensitive credentials (API tokens, passwords) from a string
 * to prevent accidental leakage in error output.
 */
export function sanitizeErrorMessage (message) {
  if (!message) return message
  // Strip Basic auth header values
  message = message.replace(/Basic\s+[A-Za-z0-9+/=]+/g, 'Basic [REDACTED]')
  // Strip API tokens in URLs (username:password@host pattern)
  message = message.replace(/\/\/[^@/]+@/g, '//[REDACTED]@')
  return message
}

export default async function () {
  let  conf
  try {
    conf = await readConfig('.toggl-cli.json')
    debug(conf)
  } catch (error) {
    console.error('Using config from environment variables or create one with the create-config command')
  }

  const apiToken = process.env.TOGGL_API_TOKEN || conf?.api_token
  debug(apiToken)

  let client
  try {
      client = togglClient({ apiToken });
  } catch (error) {
     console.error(error.message);
     console.error('There was a problem')
     process.exit(1)
   }

  // Wrap request method to handle errors and warn on quota
  const originalRequest = client.request.bind(client)
  client.request = async function (...args) {
    let result
    try {
      result = await originalRequest(...args)
    } catch (error) {
      if (NETWORK_ERROR_CODES.has(error.code)) {
        const friendlyMessage = NETWORK_ERROR_MESSAGES[error.code] || 'A network error occurred.'
        console.error(chalk.red(`\n✖ ${friendlyMessage}`))
        debug('Full error details: %O', error)
        process.exit(1)
      }
      // For non-network errors, sanitize and re-throw
      if (error.message) {
        error.message = sanitizeErrorMessage(error.message)
      }
      throw error
    }

    if (client.quota && client.quota.remaining !== null && client.quota.remaining <= QUOTA_WARNING_THRESHOLD) {
      const minutes = client.quota.resetsIn ? Math.ceil(client.quota.resetsIn / 60) : '?'
      console.error(chalk.yellow(`\n⚠ API quota low: ${client.quota.remaining} requests remaining (resets in ~${minutes}m)`))
    }
    return result
  }

  return client
}
