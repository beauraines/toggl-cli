import Client from '../client.js'
import {displayTimeEntry} from '../utils.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export const command = 'now'
export const desc = 'Displays the current running time entry'
export const builder = {}

export const handler = async function (argv) {
  const client = new Client()
  const currentTimeEntry = await client.timeEntries.current()
  // TODO - improve the output
  await displayTimeEntry(currentTimeEntry)
}
