# toggl-cli-node

A command line interface for [toggl](https://toggl.com) written in node, based on the python [TogglCli](https://github.com/AuHau/toggl-cli) project. Attempting to use similar syntax.

This was made possible because [saintedlama](https://github.com/saintedlama) had already built a node API for toggl.

## Configuration

1. Configure your environment, with environment variables or a `.env` file in the project root. Eventually, these will be read from a config file as an alternative
1. `TOGGL_API_TOKEN` (required)
2. `TOGGL_DEFAULT_WORKSPACE_ID` (required)
3. `TOGGL_DEFAULT_PROJECT_ID` (optional)
## Dependencies

1. toggl-client - saintedlama/toggl-client because the latest hasn't been released to npm
2. dayjs
3. dotenv
4. yargs

## Development Road Map

Priority order... I think.

1. today - improve the output
   1. duration to display helper function?
2. weekly - improve the output format
3. now - format the display time entry output
   
        Time tracking - cli #2462957088
        Billable: False
        Duration: 0:00:42
        Project: Worked (#174558624)
        Start: 9:41:22 AM 04/22/2022
        Stop: 
        Tags: 
        Task: 
        Workspace: beau.raines's workspace (#403916)
4. toggl continue - this command is not yet supported.
5. read configuration (token, default workspace) from files (client and utils)
6. now - update running description, project, start time
7. now - update start time with overlap detection and adjust prior time entry
8. project list - format the output, group by client
9. Add ability to lookup project by name not just id
10. start - add project name to output, add time started
11. toggl workspace add - this command is not yet supported.
12. toggl workspace list - improve output 
13. colorized output
14. config - some way to save /me information to a file
    1.  default workspace?
    2.  API key?
    3.  display formats?
15. toggl project add - this command is not yet supported.



## Planned Limitations

There are several features that I do not use from Toggl, so including them is a priority for me. I'm not opposed to them being in there and would welcome collaboration to include them.

1. tags
2. multiple workspaces
3. billable

## How to Contribute

I need to clean up and refactor the code and establish a few more helper and utility functions, but I'm open to contributions!