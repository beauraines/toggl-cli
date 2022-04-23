const Client = require('../client');


exports.command = 'now'
exports.desc = 'Displays the current running time entry'
exports.builder = {}
exports.handler = async function (argv) {

    client = new Client();
    currentTimeEntry = await client.timeEntries.current();
    // TODO - improve the output
    displayTimeEntry(currentTimeEntry);
}


function displayTimeEntry(timeEntry) {
    console.info(timeEntry);
}

