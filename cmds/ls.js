const Client = require('../client');
const dayjs = require('dayjs');
const utils = require('../utils');

exports.command = 'ls'
exports.desc = 'Lists time entries'
exports.builder = {
    
}
exports.handler = async function (argv) {
    let client = Client();
    timeEntries = await client.timeEntries.list();

    let report =[];
    timeEntries.forEach(element => {
        report.push(
            {
                description: element.description,
                start: utils.convertUtcTime(element.start),
                stop: utils.convertUtcTime(element.stop),
                duration: utils.formatDuration(element.duration*1000)
            }
        )
    });

    console.table(report,['description','start','stop','duration'])
}


