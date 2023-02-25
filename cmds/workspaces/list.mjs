import Client from '../../client.js'

export const command = 'list'
export const desc = 'Lists workspaces'

export const builder = {

}

export const handler = async function (argv) {
  const client = Client()
  const workspaces = await client.workspaces.list()
  console.log(workspaces)
}
