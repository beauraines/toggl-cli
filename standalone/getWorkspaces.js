import togglClient from 'toggl-client';
const client = togglClient();
import dotenv from 'dotenv'
dotenv.config()

async function main() {
    const workspaces = await client.workspaces.list();
    console.log(workspaces);
}

main()


