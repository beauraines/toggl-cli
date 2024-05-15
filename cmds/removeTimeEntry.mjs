import Client from '../client.js'
import dayjs from 'dayjs'

export const command = 'rm <id>'
export const desc = 'Remove a time entry by id'
export const builder = {}

export const handler = async function (argv) {
  const client = await Client()
  const deleted = await client.timeEntries.delete(argv.id)
  console.log(`Deleted time entry with id #${argv.id}`)
}
