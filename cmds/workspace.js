export const command = 'workspace <command>'
export const desc = 'Manage workspaces'

export const builder = function (yargs) {
  return yargs.commandDir('workspaces')
}

export const handler = function (argv) {}
