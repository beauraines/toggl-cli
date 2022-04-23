const Client = require('../../client');


exports.command = 'list'
exports.desc = 'Lists projects from the current workspace'
exports.builder = {
    
}
exports.handler = async function (argv) {
    let client = Client();
    workspaces = await client.workspaces.list();
    
    workspace = workspaces[0];

    console.info('Workspace: ' + workspace.name);
    console.info('id: ' + workspace.id);
    
    projects = await client.workspaces.projects(workspace.id);
    
    let activeProjects = projects.filter(x => x.active && x.cid == 56426359 )
    console.info(`Found ${activeProjects.length} projects`);
    activeProjects.map(p => {console.log(p.name + " " + p.id )})
}



