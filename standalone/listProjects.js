import togglClient from 'toggl-client'
import dotenv from 'dotenv'
const client = togglClient()
dotenv.config()

async function main () {
  const workspaces = await client.workspaces.list()

  const workspace = workspaces[0]

  console.info('Workspace: ' + workspace.name)
  console.info('id: ' + workspace.id)

  const projects = await client.workspaces.projects(workspace.id)

  const activeProjects = projects.filter(x => x.active)
  console.info(`Found ${activeProjects.length} projects`)
  activeProjects.map(p => { console.log(p.name + ' ' + p.id) })
}

main()
