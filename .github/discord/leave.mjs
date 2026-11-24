import { call, channelIn, guilds } from './api.mjs';

const all = await guilds();
const home = [];
for (const guild of all) if (await channelIn(guild.id, 'daily-codes')) home.push(guild.id);
if (home.length === 1) {
  for (const guild of all) if (guild.id !== home[0]) await call(`/users/@me/guilds/${guild.id}`, { method: 'DELETE' });
}
