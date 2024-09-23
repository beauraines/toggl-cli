import Client from '../client.js'
import dayjs from 'dayjs'

export const command = 'rm <id>'
export const desc = 'Remove a time entry by id'
export const builder = {}

export const handler = async function (argv) {
  const client = await Client()
  let deleted
  try {
    deleted = await client.timeEntries.delete(argv.id)
  } catch (error) {
    console.error(error.message)
    process.exit(1) 
  }  
  console.log(`Deleted time entry with id #${argv.id}`)
  }
