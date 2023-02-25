export const command = 'workspace-add'
export const desc = 'Creates a new workspace.'
export const builder = {}

export const handler = async function (argv) {
  console.info(`${argv.$0} ${argv._.join(' ')} - this command is not yet supported.`)
}
