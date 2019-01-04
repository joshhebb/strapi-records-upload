
const [ bin, sourcePath, ...args ] = process.argv;

/**
 * Extract a command parameter from the CLI.
 * @param {} command_param 
 */
export function getCommandParam(command_param) {
    return args.filter(param => param.includes(command_param + '='))
                      .map(param => param.replace(command_param + '=',''))
                      .find(param => param !== undefined)
}