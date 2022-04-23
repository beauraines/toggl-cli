const Client = require('../../client');


exports.command = 'list'
exports.desc = 'Lists workspaces'
exports.builder = {
    
}
exports.handler = async function (argv) {
    let client = Client();
    workspaces = await client.workspaces.list();
    console.log(workspaces);
}



