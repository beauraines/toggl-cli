# toggl-cli-node

**UPDATED TO USE Toggl v9 API**

A command line interface for [toggl](https://toggl.com) written in node, based on the python [TogglCli](https://github.com/AuHau/toggl-cli) project. Attempting to use similar syntax.

This was made possible because [saintedlama](https://github.com/saintedlama) had already built a node API for toggl.

## Configuration

1. Configure your environment, with environment variables or a `.env` file in the project root. Eventually, these will be read from a config file as an alternative
1. `TOGGL_API_TOKEN` (required)
2. `TOGGL_DEFAULT_WORKSPACE_ID` (required)
3. `TOGGL_DEFAULT_PROJECT_ID` (optional)
4. `TOGGL_TIMEZONE=America/Los_Angeles` (defaults to `America/New_York`)
## Dependencies

1. toggl-client - Used from [saintedlama/toggl-client](https://github.com/saintedlama/toggl-client) repository as the latest code hasn't been released to npm
3. dotenv
4. yargs



## Features

| Feature                              | Available | Comments                                                    |
| ------------------------------------ | --------- | ----------------------------------------------------------- |
| Start time entry                     | ✅         |                                                             |
| Start time entry with description    | ✅         |                                                             |
| Start time entry with project        | ✅         |                                                             |
| stop time entry                      | ✅         |                                                             |
| Continue named time entry            | ✅         |                                                             |
| Report today by project              | ✅         |                                                             |
| Report this week by project by day   | ✅         |                                                             |
| Edit time entry                      | ✅         |                                                             |
| Use config from file                 |           |                                                             |
| Save config to file                  |           |                                                             |
| Refactor: Display and format modules |           |                                                             |
| Client: reset PAT                    |           |                                                             |
| Client: other user feature?          |           |                                                             |
| Client: specify client name          |           |                                                             |
| Colorize output                      |           |                                                             |
| Better table output                  |           |                                                             |
| List recent time entries             | ✅         |                                                             |
| Command line completion              | ✅         | [#6](https://github.com/beauraines/toggl-cli-node/issues/6) |

## Development Road Map

Priority order... I think.

1. ~today - improve the output~
2. ~weekly - improve the output format~
3. ~now - format the display time entry output~
4. ~toggl continue~
5. ~duration to display helper function?~
6. read configuration (token, default workspace) from files (client and utils)
7. now - update running description, project, start time
8. now - update start time with overlap detection and adjust prior time entry
9. project list - format the output, group by client
10. Add ability to lookup project by name not just id
11. start - add project name to output, add time started
12. toggl workspace add - this command is not yet supported.
13. toggl workspace list - improve output 
14. colorized output
15. config - some way to save /me information to a file
    1.  default workspace?
    2.  API key?
    3.  display formats?
16. toggl project add - this command is not yet supported.



## Planned Limitations

There are several features that I do not use from Toggl, so including them is a priority for me. I'm not opposed to them being in there and would welcome collaboration to include them.

1. tags
2. multiple workspaces
3. billable

## How to Contribute

I need to clean up and refactor the code and establish a few more helper and utility functions, but I'm open to contributions!


