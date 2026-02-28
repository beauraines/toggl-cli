import Client from '../client.js'
import chalk from 'chalk'
import { defaultWorkspaceId } from '../utils.js'

export const command = 'quota'
export const desc = 'Displays API quota usage information'
export const builder = {}

function formatQuota(remaining, resetsIn) {
  let remainingDisplay
  if (remaining > 10) {
    remainingDisplay = chalk.green(remaining)
  } else if (remaining > 5) {
    remainingDisplay = chalk.yellow(remaining)
  } else {
    remainingDisplay = chalk.red(remaining)
  }

  let resetDisplay = ''
  if (resetsIn !== null) {
    const minutes = Math.floor(resetsIn / 60)
    const seconds = resetsIn % 60
    resetDisplay = ` (resets in ${minutes}m ${seconds}s)`
  }

  return `${remainingDisplay} requests${resetDisplay}`
}

export const handler = async function (argv) {
  const client = await Client()

  // Call a user-specific endpoint to get the user quota
  await client.user.current()
  const userQuota = client.quota ? { ...client.quota } : null

  // Call a workspace-scoped endpoint to get the workspace/org quota
  await client.workspaces.projects(defaultWorkspaceId)
  const workspaceQuota = client.quota ? { ...client.quota } : null

  if (!userQuota && !workspaceQuota) {
    console.log('No API quota information available in the response headers.')
    console.log('The Toggl API may not be returning quota headers yet.')
    return
  }

  if (workspaceQuota && workspaceQuota.remaining !== null) {
    console.log(`Workspace quota: ${formatQuota(workspaceQuota.remaining, workspaceQuota.resetsIn)}`)
  }

  if (userQuota && userQuota.remaining !== null) {
    console.log(`User quota:      ${formatQuota(userQuota.remaining, userQuota.resetsIn)}`)
  }

  const low = [userQuota, workspaceQuota].some(q => q && q.remaining !== null && q.remaining <= 5)
  if (low) {
    console.log(chalk.red('\n⚠ Warning: API quota is running low!'))
    console.log(chalk.red('Consider waiting before making more requests.'))
  }
}
