import Client from '../../client.js'

export const command = 'project-list'
export const desc = 'Lists projects from the current workspace'

export const builder = {

}

export const handler = async function (argv) {
  const client = Client()
  const workspaces = await client.workspaces.list()

  const workspace = workspaces[0]

  console.info('Workspace: ' + workspace.name)
  console.info('id: ' + workspace.id)

  const projects = await client.workspaces.projects(workspace.id)

  const activeProjects = projects.filter(x => x.active)
  console.info(`Found ${activeProjects.length} projects`)
  activeProjects.map(p => { console.log(p.name + ' ' + p.id) })

  console.log(activeProjects[0])
}
