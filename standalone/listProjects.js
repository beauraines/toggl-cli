const togglClient = require('toggl-client');
const client = togglClient();
require('dotenv').config()

async function main() {
    workspaces = await client.workspaces.list();
    
    workspace = workspaces[0];

    console.info('Workspace: ' + workspace.name);
    console.info('id: ' + workspace.id);
    
    projects = await client.workspaces.projects(workspace.id);
    
    let activeProjects = projects.filter(x => x.active )
    console.info(`Found ${activeProjects.length} projects`);
    activeProjects.map(p => {console.log(p.name + " " + p.id )})
}

main()