import { call, channelIn, guilds } from './api.mjs';
import { verifyCard } from './verify-card.mjs';

const me = await call('/users/@me');
for (const guild of await guilds()) {
  const channel = await channelIn(guild.id, 'verify');
  if (!channel) continue;
  const messages = await call(`/channels/${channel.id}/messages?limit=20`);
  const mine = messages.find((message) => message.author.id === me.id);
  if (mine) await call(`/channels/${channel.id}/messages/${mine.id}`, { method: 'PATCH', json: verifyCard });
  else await call(`/channels/${channel.id}/messages`, { method: 'POST', json: verifyCard });
}
