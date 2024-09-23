import { defaultWorkspaceId, getProjectByName, createTimeEntry, getProjectById, defaultProjectId, parseTime } from '../utils.js'
import dayjs from 'dayjs'

export const command = 'start'
export const desc = 'Starts a time entry'

export const builder = {
  d: {
    alias: ['description'],
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
  const timeEntry = await createTimeEntry(params)
  console.info(`Started ${timeEntry?.description} ${project?.name ? `for project ${project.name}` : 'without a project'}`)
}
