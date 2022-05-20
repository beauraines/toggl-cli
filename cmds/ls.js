const Client = require('../client');
const dayjs = require('dayjs');


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
                start: formatDateTime(element.start),
                stop: formatDateTime(element.stop),
                duration: formatDuration(element.duration)
            }
        )
    });

    console.table(report,['description','start','stop','duration'])
}

// TODO move these to a utility module
/**
 * Formats a dateTime to YYYY-MM-DD HH:mm
 * @param {Date} dateTime 
 * @returns {String}
 */
function formatDateTime(dateTime) {
    let tz = process.env.TOGGL_TIMEZONE || 'America/New_York';
    return dayjs(dateTime).tz(tz).format('YYYY-MM-DD HH:mm');
}
/**
 * Converts duration in milliseconds to hours minutes
 * @param {Number} duration 
 * @returns {String} 
 */
function formatDuration(duration) {
    return dayjs.duration(duration*1000).format('H[h] m[m]');
}
