exports.command = 'project <command>'
exports.desc = 'Manage projects'
exports.builder = function (yargs) {
  return yargs.commandDir('projects')
}
exports.handler = function (argv) {}