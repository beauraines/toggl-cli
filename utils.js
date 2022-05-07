const Client = require('./client');

// TODO read from file or GET /me
exports.defaultWorkspaceId = process.env.TOGGL_DEFAULT_WORKSPACE_ID;

// TODO read from file or ENV
exports.defaultProjectId = process.env.TOGGL_DEFAULT_PROJECT_ID;

exports.getProjects = async function(workspaceId) {
    const client = Client();
    let projects = await client.workspaces.projects(workspaceId);
    let activeProjects = projects.filter(x => x.active)
    return activeProjects;
}

exports.getWorkspace = async function() {
    const client = Client();
    let workspaces = await client.workspaces.list();
    return workspaces[0];
}

exports.getProjectByName = async function(workspaceId,string) {
    const client = Client();
    let projects = await client.workspaces.projects(workspaceId);
    return projects.find(x=>x.name.toLowerCase().includes(string.toLowerCase()));
}

exports.getProjectById = async function(workspaceId,projectId) {
    const client = Client();
    let projects = await client.workspaces.projects(workspaceId);
    return projects.find(x=>x.id == projectId);
}