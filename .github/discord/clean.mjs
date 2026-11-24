import { call, guilds } from './api.mjs';

const app = await call('/oauth2/applications/@me');
await call(`/applications/${app.id}/commands`, { method: 'PUT', json: [] });
for (const guild of await guilds()) await call(`/applications/${app.id}/guilds/${guild.id}/commands`, { method: 'PUT', json: [] });
