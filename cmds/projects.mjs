import { projects } from './projects/index.mjs'


export const command = 'project <command>'
export const desc = 'Manage projects'

export const builder = function (yargs) {
  return yargs.command(projects)
}

export const handler = function (argv) {}
