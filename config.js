import fs from 'fs';
import {homedir} from 'os';
import path from 'path';

/**
 * Reads the specified config file from the users home directory
 * 
 * @param {string} configFile file name for the JSON config file, from the users home directory
 * 
 * @returns {Promise} the configuration object
 * 
 * @throws {Error} if configuration file not found.
 */
export const readConfig = async (configFile) => {
    configFile = path.join(homedir(),configFile)
	let config
	if ( await fs.existsSync(configFile) ) {
		config = fs.readFileSync(configFile,
			{ encoding: 'utf8', flag: 'r' });
		config = JSON.parse(config);
	} else {
        throw new Error(`Config file not found. You must create one using the config command`)
	}
	
	return config
}

/**
 * Validates the config file to ensure that it has all of the required properties specified. This 
 * is only schema validation, it does not check if the properties are valid values or data types.
 * 
 * @param {string} configFile file name for the JSON config file, from the users home directory
 * @param {Array} configProps an array of properties that defines a valid config file
 * 
 * @throws {Configuration file not found}
 * @throws {Invalid configuration file}
 * @returns {boolean} 
 */
export const validateConfig = async (configFile, configProps) => {
    configFile = path.join(homedir(),configFile)
    if (! fs.existsSync(configFile) ) {
        throw new Error('Configuration file not found')
    }
    let config
    config = fs.readFileSync(configFile,
        { encoding: 'utf8', flag: 'r' });
    config = JSON.parse(config);
    // Check for properties
    let validConfig = true
    for (const key of configProps) {
        validConfig = config[key] ? true : false
    }

    if (!validConfig) {
        throw Error('Invalid configuration file')
    }
    return validConfig
}

/**
 * Creates a boilerplate config file in the user's home directory
 * 
 * @param {string} configFile file name for the JSON config file, from the users home directory
 * @param {Array} configProps an array of properties that defines a valid config file
 * 
 * @returns {string} Fully qualified path to configuration file
 * 
 * @throws {error} if the file already exists
 * 
 */
export const createConfig = async (configFile,configProps) => {
    configFile = path.join(homedir(),configFile)
    if ( await fs.existsSync(configFile) ) {
        throw Error('File already exists. Will not overwrite')
    }
    let config = {}
    for (const key of configProps) {
        config[key] = ''
    }
    fs.writeFileSync(configFile,JSON.stringify(config, null, 2))
    return configFile
}
