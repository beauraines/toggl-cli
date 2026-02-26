import Client from '../client.js'
import chalk from 'chalk'

export const command = 'quota'
export const desc = 'Displays API quota usage information'
export const builder = {}

export const handler = async function (argv) {
  const client = await Client()

  // Make a lightweight API call to populate quota headers
  await client.user.current()

  if (!client.quota || client.quota.remaining === null) {
    console.log('No API quota information available in the response headers.')
    console.log('The Toggl API may not be returning quota headers yet.')
    return
  }

  const { remaining, resetsIn } = client.quota

  // Color-code the remaining count
  let remainingDisplay
  if (remaining > 10) {
    remainingDisplay = chalk.green(remaining)
  } else if (remaining > 5) {
    remainingDisplay = chalk.yellow(remaining)
  } else {
    remainingDisplay = chalk.red(remaining)
  }

  console.log(`Quota remaining: ${remainingDisplay} requests`)

  if (resetsIn !== null) {
    const minutes = Math.floor(resetsIn / 60)
    const seconds = resetsIn % 60
    console.log(`Resets in: ${minutes}m ${seconds}s`)
  }

  if (remaining <= 5) {
    console.log(chalk.red('\n⚠ Warning: API quota is running low!'))
    console.log(chalk.red('Consider waiting before making more requests.'))
  }
}
