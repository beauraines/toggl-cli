import Client from '../client.js'
import dayjs from 'dayjs'

export const command = 'stop'
export const desc = 'Stops the current running time entry'
export const builder = {}

export const handler = async function (argv) {
  const client = Client()
  const currentTimeEntry = await client.timeEntries.current()
  if (currentTimeEntry) {
    const stopped = await client.timeEntries.stop(currentTimeEntry.id)
    const duration = dayjs.duration(stopped.duration * 1000).format('H[h] m[m]')
    console.log(`Stopped ${stopped.description} after ${duration}`)
  }
}
