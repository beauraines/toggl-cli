export const command = 'project <command>'
export const desc = 'Manage projects'

export const builder = function (yargs) {
  return yargs.commandDir('projects')
}

export const handler = function (argv) {}
