const utils = require('../utils');

exports.command = 'start'
exports.desc = 'Starts a time entry'
exports.builder = {
    description: {
        describe: 'Time entry name',
        type: "string:"
    },
    p: { alias: "projectId", describe: "project id", type: "string", demandOption: false },
    // TODO default to default workspace
    w: { alias: "workspaceId", describe: "workspace id", type: "number", demandOption: false }
}
exports.handler = async function (argv) {

    // console.info(`${argv.$0} ${argv._.join(' ')} - this command is not yet supported.`);
    // console.debug(argv);
    // TODO validate options
    // TODO check that description was provided or provide a default
    let params = {};
    params.description = argv.description || argv._.slice(1).join(' ') || 'no description';
    // TODO lookup workspace
    params.workspaceId = utils.defaultWorkspaceId;
    let project;
    if (argv.projectId) {
        if(isNaN(argv.projectId)) {
            project = await utils.getProjectByName(params.workspaceId,argv.projectId)
         } else {
            project = await utils.getProjectById(params.workspaceId,argv.projectId)
         }
    }
         
    params.projectId = project?.id || utils.defaultProjectId || null;
    // TODO check for invalid projectId or catch the error when creating fails
    let timeEntry = await utils.createTimeEntry(params);
    console.info(`Started ${timeEntry?.description} ${project?.name ? `for project ${project.name}` : 'without a project'}`);
}
