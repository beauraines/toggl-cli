exports.command = 'me'
exports.desc = 'Displays the current user'
exports.builder = {}
exports.handler = async function (argv) {

    console.info(`${argv.$0} ${argv._.join(' ')} - this command is not yet supported.`);
}



