import Client from '../client.js'
import utils from '../utils.js'

export const command = 'continue [description]'

export const desc = 'Continues an existing time entry. If description is included it will search for the most' +
    'recent entry including that description. If no description is provided, the most recent entry will be restarted.'

export const builder = {
  description: {
    describe: 'The time entry to continue',
    type: 'string'
  }
  //   -s, --start DATETIME  Sets a start time.
}

export const handler = async function (argv) {
  const client = Client()
  const timeEntries = await client.timeEntries.list() // Gets time entries for last 9 days, up to 1000 entries
  let matchingTimeEntry
  switch (argv.description) {
    case undefined:
      matchingTimeEntry = timeEntries.slice(-1)[0]
      break
    default:
      { const searchName = argv.description.toLowerCase()
        matchingTimeEntry = timeEntries.find(x => x.description.toLowerCase().includes(searchName)) }
      break
  }

  const params = {
    projectId: matchingTimeEntry?.pid,
    workspaceId: matchingTimeEntry?.wid,
    description: matchingTimeEntry?.description || 'no description',
    billable: matchingTimeEntry?.billable,
    dur: matchingTimeEntry?.dur
  }

  if (matchingTimeEntry) {
    const timeEntry = await utils.createTimeEntry(params)
    const project = await utils.getProjectById(timeEntry.wid, timeEntry.pid)
    console.info(`Continued ${timeEntry?.description} for project ${project?.name}`)
  } else {
    console.info('No matching time entry found!')
  }
}
