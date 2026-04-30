import chalk from 'chalk'
import debugClient from 'debug'
import { sanitizeErrorMessage } from './client.js'

const debug = debugClient('toggl-cli-error')

/**
 * Wraps a yargs command handler with error handling that catches
 * unhandled errors and displays a user-friendly message instead
 * of a raw stack trace with sensitive data.
 *
 * @param {Function} handler - The async handler function to wrap
 * @returns {Function} - The wrapped handler
 */
export function withErrorHandling (handler) {
  return async function (argv) {
    try {
      await handler(argv)
    } catch (error) {
      const message = sanitizeErrorMessage(error.message) || 'An unexpected error occurred.'
      console.error(chalk.red(`\n✖ ${message}`))
      debug('Full error details: %O', error)
      process.exit(1)
    }
  }
}
