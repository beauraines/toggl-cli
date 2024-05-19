import { defaultWorkspaceId,getProjectByName, createTimeEntry, getProjectById, defaultProjectId } from '../utils.js'
import dayjs from 'dayjs'

export const command = 'start'
export const desc = 'Starts a time entry'

export const builder = {
  description: {
    describe: 'Time entry name',
    type: 'string:'
  },
  p: { alias: ['projectId', 'project'], describe: 'The case insensitive project name or project id.', type: 'string', demandOption: false },
  // TODO default to default workspace
  w: { alias: ['workspaceId', 'workspace'], describe: 'The case insensitive workspace name or workspace id.', type: 'number', demandOption: false },
  s: { alias: ['start', 'startTime'], describe: 'The start time for the task, e.g. 13:00 12:45AM.', type: 'string', demandOption: false },
}

export const handler = async function (argv) {
  // console.info(`${argv.$0} ${argv._.join(' ')} - this command is not yet supported.`);
  // console.debug(argv);
  // TODO validate options
  // TODO check that description was provided or provide a default
  const params = {}
  params.description = argv.description || argv._.slice(1).join(' ') || 'no description'
  // TODO lookup workspace
  params.workspaceId = defaultWorkspaceId
  let project
  if (argv.projectId) {
    if (isNaN(argv.projectId)) {
      project = await getProjectByName(params.workspaceId, argv.projectId)
    } else {
      project = await getProjectById(params.workspaceId, argv.projectId)
    }
  }

  if (argv.startTime) {
    let startTime;
    console.log(argv)
    if (dayjs(argv.startTime).isValid()) {
      startTime = argv.startTime
    } else {
      // Parse the time and set it based upon the current time
      startTime = parseTime(argv.startTime)
    }

    params.start = startTime.toISOString()
    params.duration = -1
  }

  params.projectId = project?.id || defaultProjectId || null
  // TODO check for invalid projectId or catch the error when creating fails
  console.log(params)
  const timeEntry = await createTimeEntry(params)
  console.log(timeEntry)
  console.info(`Started ${timeEntry?.description} ${project?.name ? `for project ${project.name}` : 'without a project'}`)
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
  } else if (h == 12) {
    h = 0
  }
  return dayjs().hour(h).minute(m).second(0).millisecond(0)
}
