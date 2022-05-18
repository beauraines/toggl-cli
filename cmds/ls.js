const Client = require('../client');


exports.command = 'ls'
exports.desc = 'Lists time entries'
exports.builder = {
    
}
exports.handler = async function (argv) {
    let client = Client();
    timeEntries = await client.timeEntries.list();
    console.table(timeEntries,['description','start','stop','duration'])
}



