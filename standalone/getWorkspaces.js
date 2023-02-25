import togglClient from 'toggl-client'
import dotenv from 'dotenv'
const client = togglClient()
dotenv.config()

async function main () {
  const workspaces = await client.workspaces.list()
  console.log(workspaces)
}

main()
