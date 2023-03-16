/* eslint-disable no-unused-expressions */
import Client from '../client.js'
import { defaultWorkspaceId, getProjectByName, getProjectById, appName, displayTimeEntry } from '../utils.js'
import dayjs from 'dayjs'
import debugClient from 'debug'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import yargs from 'yargs'
dayjs.extend(utc)
dayjs.extend(timezone)

const debug = debugClient('rtm-cli-edit');

export const command = 'edit'
// FIXME editing not working
export const desc = 'Edits the current running time entry. Only updating the time is supported and the time must be parsable by dayjs, e.g. 4:50PM or \'12:00 AM\'.'

export const builder = {
  d: { alias: ['description'], describe: 'Time entry name', type: 'string:' },
  p: { alias: ['projectId', 'project'], describe: 'The case insensitive project name or project id.', type: 'string', demandOption: false },
  s: { alias: ['start', 'startTime'], describe: 'The start time for the task, e.g. 13:00 12:45AM.', type: 'string', demandOption: false },
  e: { alias: ['end', 'endTime'], describe: 'The end time for the task, e.g. 13:00 12:45AM.', type: 'string', demandOption: false }
}

export const handler = async function (argv) {
  if (!(argv.d || argv.p || argv.s || argv.e)) {
    console.error('At least one option must be provided, description, project, start or end')
    yargs().help()
    yargs().exit(1, new Error('At least one option must be provided, description, project, start or end'))
  }
  const client = new Client()
  const currentTimeEntry = await client.timeEntries.current()

  const params = {}

  params.workspace_id = +defaultWorkspaceId
  let project
  if (argv.projectId) {
    if (isNaN(argv.projectId)) {
      project = await getProjectByName(params.workspace_id, argv.projectId)
    } else {
      project = await getProjectById(params.workspace_id, argv.projectId)
    }
  }

  let startTime, endTime
  if (dayjs(argv.startTime).isValid()) {
    startTime = argv.startTime
  } else {
    // Parse the time and set it based upon the current time
    startTime = parseTime(argv.startTime)
  }

  if (dayjs(argv.endTime).isValid()) {
    endTime = argv.endTime
  } else {
    // Parse the time and set it based upon the current time
    endTime = parseTime(argv.endTime)
  }

  params.created_with = appName
  params.at = dayjs().toISOString()
  project ? params.project_id = +project.id : undefined
  startTime ? params.start = startTime.toISOString() : undefined
  endTime ? params.stop = endTime.toISOString() : undefined
  argv.description ? params.description = argv.description : undefined
  debug(params)
  const timeEntry = await client.timeEntries.update(currentTimeEntry.id, params)
  await displayTimeEntry(timeEntry)
}

/**
 * Parses a timelike string into a dayjs object of the current date and that time
 * @param {string} timeString timelike string e.g. 4:50PM '12:00 AM' etc.
 * @returns {object} dayjs object
 */
function parseTime (timeString) {
  let h, m
  // Assumes time in format 4:50 PM
  const time = timeString.split(':', 2)
  h = time[0]
  m = time[1].match(/[0-9]+/)[0]
  if (timeString.match(/PM/i) && h <= 12) {
    // + in front of string converts to a number, cool!
    h = +h + 12
  }
  return dayjs().hour(h).minute(m).second(0)
}
