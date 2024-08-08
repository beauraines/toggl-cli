import Client from './client.js'
import chalk from 'chalk';
import dayjs from 'dayjs'
import utc  from "dayjs/plugin/utc.js";
import timezone from 'dayjs/plugin/timezone.js';
import duration from 'dayjs/plugin/duration.js';
import { readConfig } from './config.js'
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

let conf
try {
  conf = await readConfig('.toggl-cli.json')
} catch (error) {
  console.error('Using config from environment variables or create one with the create-config command')
}

export const defaultWorkspaceId = process.env.TOGGL_DEFAULT_WORKSPACE_ID || conf.default_workspace_id 

export const defaultProjectId = process.env.TOGGL_DEFAULT_PROJECT_ID || conf.default_project_id

export const getProjects = async function (workspaceId) {
  const client = await Client()
  const projects = await client.workspaces.projects(workspaceId)
  const activeProjects = projects.filter(x => x.active)
  return activeProjects
}

export const getWorkspace = async function () {
  const client = await Client()
  const workspaces = await client.workspaces.list()
  return workspaces[0]
}

export const getProjectByName = async function (workspaceId, string) {
  const client = await Client()
  const projects = await client.workspaces.projects(workspaceId)
  return projects.find(x => x.name.toLowerCase().includes(string.toLowerCase()))
}

export const getProjectById = async function (workspaceId, projectId) {
  const client = await Client()
  const projects = await client.workspaces.projects(workspaceId)
  return projects.find(x => x.id == projectId)
}

export const createTimeEntry = async function (params) {
  const client = await Client()

  const timeEntry = await client.timeEntries.create(
    {
      description: params.description,
      workspace_id: +params.workspaceId,
      project_id: +params.projectId,
      start: params.start ? params.start : dayjs().toISOString(),
      duration: -1 * dayjs().unix(),
      created_with: appName,
      at: dayjs().toISOString()
    }
  )
  return timeEntry
}

/**
 *
 * @param {number} milliseconds , if negative the time entry is assumed to be running
 * @returns {string} duration formatted as 25h 32m where duration greater than a day displays
 * total hours
 */
export const formatDuration = function (milliseconds) {
  if (milliseconds < 0) {
    const seconds = milliseconds / 1000
    const startTime = dayjs.unix(seconds * -1)
    const duration = dayjs().diff(startTime, 's')
    return dayjs.duration(duration * 1000).format('H[h] m[m]')
  }
  const dur = dayjs.duration(milliseconds)
  const hours = (dur.days() * 24) + dur.hours()
  const duration = `${hours}h ${dur.minutes()}m`
  return duration
}

/**
 *
 * @param {number} milliseconds
 * @returns {String} the duration formatted as H:mm:ss
 */
export const formatDurationAsTime = function (milliseconds) {
  return dayjs.duration(milliseconds).format('H:mm:ss')
}

/**
 * Formats a dateTime to YYYY-MM-DD HH:mm
 * @param {Date} dateTime
 * @returns {String}
 */
export const convertUtcTime = function (dateTime) {
  const tz = process.env.TOGGL_TIMEZONE || conf?.timezone || 'America/New_York'
  return dayjs(dateTime).tz(tz).format('YYYY-MM-DD HH:mm')
}

export const appName = '@beauraines/toggl-cli'

/**
 * Displays a time entry on the console
 * @param {TimeEntry} timeEntry
 */
export const displayTimeEntry = async function (timeEntry) {
  if (!timeEntry) {
    console.log('There is no time entry running!')
  } else {
    console.info(`${chalk.blueBright(timeEntry.description ? timeEntry.description : 'no description')} ${chalk.yellow('#'+timeEntry.id)}`)
    console.info(`Billable: ${chalk.gray(timeEntry.billable)}`)

    let stopTime;
    if (timeEntry.stop == null) {
      stopTime = dayjs()
    } else {
      stopTime = dayjs(timeEntry.stop)
    }

    const duration = stopTime.diff(dayjs(timeEntry.start))
    const durationFormatted = dayjs.duration(duration).format('H[h] m[m]')
    console.info(`Duration: ${chalk.green(durationFormatted)}`)

    const projects = await getProjects(timeEntry.wid)
    const project = projects.find(x => x.id == timeEntry.pid)

    console.info(`Project: ${project?.name} (#${timeEntry.pid})`);

    const tz = process.env.TOGGL_TIMEZONE || conf?.timezone || 'America/New_York'
    const startTimeFormatted = dayjs(timeEntry.start).tz(tz).format('YYYY-MM-DD HH:mm')
    const stopTimeFormatted = timeEntry.stop ? dayjs(timeEntry.stop).tz(tz).format('YYYY-MM-DD HH:mm') : 'Currently Running'

    console.info(`Start: ${startTimeFormatted}`)
    console.info(`Stop: ${stopTimeFormatted}`) // This will always be blank for the current entry, but will be useful for a time entry
    // console.info(`Tags: `); // Not going to include these in the near term
    // console.info(`Task: `); // Not going to include these in the near term

    const workspace = await getWorkspace()
    console.info(`Workspace: ${workspace.name} (#${timeEntry.wid})`)
  }
}

/**
 * Parses a timelike string into a dayjs object of the current date and that time
 * @param {string} timeString timelike string e.g. 4:50PM '12:00 AM' etc.
 * @returns {object} dayjs object
 */
export function parseTime (timeString) {
  let h_orig, h, m
  // Assumes time in format 4:50 PM
  const time = timeString.split(':', 2)

  // + in front of string converts to a number, cool!
  h_orig = +time[0]
  m = +time[1].match(/[0-9]+/)[0]

  if (h_orig > 12) {
    // 24 hour time
    h = h_orig
  } else if (h_orig == 12) {
    // 12 is a special case
    h = timeString.match(/PM/i) ? 12 : 0
  } else {
    // 12 hour time
    h = h_orig
    if (timeString.match(/PM/i)) h += 12
  }
  return dayjs().hour(h).minute(m).second(0).millisecond(0)
}
