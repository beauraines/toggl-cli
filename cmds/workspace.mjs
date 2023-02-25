import { workspaces } from './workspaces/index.mjs'

export const command = 'workspace <command>'
export const desc = 'Manage workspaces'

export const builder = function (yargs) {
  return yargs.command(workspaces)
}

export const handler = function (argv) {}
