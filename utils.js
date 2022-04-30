const Client = require('./client');

exports.defaultWorkspaceId = 403916;

exports.defaultProjectId = 174558624;

exports.getProjects = async function(workspaceId) {
    const client = Client();
    projects = await client.workspaces.projects(workspaceId);
    let activeProjects = projects.filter(x => x.active)
    return activeProjects;
}


exports.getWorkspace = async function() {
    const client = Client();
    workspaces = await client.workspaces.list();
    return workspaces[0];
}
