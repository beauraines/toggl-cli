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



