import Client from '../client.js'
import { displayTimeEntry } from '../utils.js'
import debugClient from 'debug';

const debug = debugClient('toggl-cli-now');

export const command = 'now'
export const desc = 'Displays the current running time entry'
export const builder = {}

export const handler = async function (argv) {
  const client = await Client()
  const currentTimeEntry = await client.timeEntries.current()
  if (currentTimeEntry) {
    debug(currentTimeEntry)
    await displayTimeEntry(currentTimeEntry)
  } else {
    console.log('There is no time entry running!')
  }
}
