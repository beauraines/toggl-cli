import Client from 'toggl-client'
import { displayTimeEntry } from '../utils.js'
import dotenv from 'dotenv'
dotenv.config()

async function main () {
  const client = await Client()
  const currentTimeEntry = await client.timeEntries.current()
  await displayTimeEntry(currentTimeEntry)
}

main()
