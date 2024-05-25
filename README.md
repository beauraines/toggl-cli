# toggl-cli-node

**UPDATED TO USE Toggl v9 API**

A command line interface for [toggl](https://toggl.com) written in node, based on the python [TogglCli](https://github.com/AuHau/toggl-cli) project. Attempting to use similar syntax.

This was made possible because [saintedlama](https://github.com/saintedlama) had already built a node API for toggl.

## Configuration

### Configuration File

You can create the `.toggl-cli.json` in your home directory manually using the template below or with the `toggl create-config` command. The values can be found in your Toggl [profile](https://track.toggl.com/profile) and from the URL for your account settings. The current workspace id is `https://track.toggl.com/${workspace_id}}/settings/general`. Don't forget to change the permissions `chmod 600` so that only you can read/write the configuration file as it has your API token.

```json
{
  "api_token": "",
  "default_workspace_id": "",
  "timezone": "",
  "default_project_id": ""
}
```
### Environment Variables

Configure your environment, with environment variables or a `.env` file in the project root. Environment variables will take precedence over a config file.

1. `TOGGL_API_TOKEN` (required)
2. `TOGGL_DEFAULT_WORKSPACE_ID` (required)
3. `TOGGL_DEFAULT_PROJECT_ID` (optional)
4. `TOGGL_TIMEZONE=America/Los_Angeles` (defaults to `America/New_York`)


## Features

| Feature                                  | Available | Comments                                                    |
| ---------------------------------------- | --------- | ----------------------------------------------------------- |
| Start time entry                         | ✅         |                                                             |
| Start time entry with description        | ✅         |                                                             |
| Start time entry with project            | ✅         |                                                             |
| stop time entry                          | ✅         |                                                             |
| Continue named time entry                | ✅         |                                                             |
| Report today by project                  | ✅         |                                                             |
| Report this week by project by day       | ✅         |                                                             |
| Edit current time entry                  | ✅         |                                                             |
| Use config from file                     | ✅         |                                                             |
| Save config to file                      | ✅         |                                                             |
| Refactor: Display and format modules     |            |                                                             |
| Client: reset PAT                        |            | Is this really necessary?                                   |
| Client: specify client name              | ✅         |                                                             |
| Colorize output                          | ✅         |                                                             |
| Better table output                      | ✅         |                                                             |
| List recent time entries                 | ✅         |                                                             |
| Command line completion                  | ✅         | [#6](https://github.com/beauraines/toggl-cli-node/issues/6) |
| Delete time entry by id                  |            |                                                             |
| Edit other time entries than the current |            |                                                             |
| Display earlier time entries             |            |                                                             |



## Planned Limitations

There are several features that I do not use from Toggl, so including them is a priority for me. I'm not opposed to them being in there and would welcome collaboration to include them.

1. tags
2. multiple workspaces
3. billable

## How to Contribute

I need to clean up and refactor the code and establish a few more helper and utility functions, but I'm open to contributions!


## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

