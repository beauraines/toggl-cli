import Client from 'toggl-client'
import { displayTimeEntry } from '../utils.js'
import dotenv from 'dotenv'
dotenv.config()

async function main () {
  const client = new Client()
  const currentTimeEntry = await client.timeEntries.current()
  await displayTimeEntry(currentTimeEntry)
}

main()
