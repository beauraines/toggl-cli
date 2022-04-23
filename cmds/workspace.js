exports.command = 'workspace <command>'
exports.desc = 'Manage workspaces'
exports.builder = function (yargs) {
  return yargs.commandDir('workspaces')
}
exports.handler = function (argv) {}