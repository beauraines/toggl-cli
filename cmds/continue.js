exports.command = 'continue <description>'
exports.desc = 'Continues an existing time entry'
exports.builder = {
    description: {
        describe: 'The time entry to continue',
        type: 'string'
    }
}
exports.handler = async function (argv) {
    console.info(`${argv.$0} ${argv._.join(' ')} - this command is not yet supported.`);
    console.info(`Would have tried to continue the time entry with ${argv.description}`)
}


// from toggl-cli
// Usage: toggl continue [OPTIONS] [DESCR]

//   If DESCR is specified then it will search this entry and continue it,
//   otherwise it continues the last time entry.

//   The underhood behaviour of Toggl is that it actually creates a new entry
//   with the same description.

// Options:
//   -s, --start DATETIME  Sets a start time.
//   --help                Show this message and exit.


