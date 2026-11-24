import { call, channelIn, guilds } from './api.mjs';

const VIEW = 1024n, SEND = 2048n, EMBED = 16384n, ATTACH = 32768n, HISTORY = 65536n, MANAGE_CHANNELS = 16n, MANAGE_MESSAGES = 8192n;
const TYPES = {
  bug: ['Bug or crash', 'Something broke or does not work as it should.'],
  plan: ['Plan or account', 'Your plan, Discord login or account.'],
  codes: ['Codes and gifts', 'A code or gift that did not work.'],
  boost: ['Boost and ping', 'Game Boost, FPS or network help.'],
  idea: ['Idea or suggestion', 'Something you would like in the app.'],
  other: ['Something else', 'Anything that does not fit above.']
};

let guild;
for (const entry of await guilds()) if (await channelIn(entry.id, 'daily-codes')) guild = entry.id;
if (!guild) throw new Error('KeyBind Master server not found');
const me = await call('/users/@me');
const channels = await call(`/guilds/${guild}/channels`);
const category = channels.find((entry) => entry.type === 4 && entry.name.toLowerCase() === 'help desk') ?? (await call(`/guilds/${guild}/channels`, { method: 'POST', json: { name: 'Help desk', type: 4 } }));
const panel = channels.find((entry) => entry.type === 0 && entry.name === 'tickets') ?? (await call(`/guilds/${guild}/channels`, {
  method: 'POST',
  json: {
    name: 'tickets', type: 0, parent_id: category.id, topic: 'Questions or problems? Talk to the staff in a private ticket.',
    permission_overwrites: [{ id: guild, type: 0, deny: String(SEND), allow: String(VIEW | HISTORY) }, { id: me.id, type: 1, allow: String(VIEW | SEND | EMBED | ATTACH | HISTORY | MANAGE_CHANNELS | MANAGE_MESSAGES) }]
  }
}));
const old = (await call(`/channels/${panel.id}/messages?limit=50`)) ?? [];
for (const message of old) if (message.author?.id === me.id) await call(`/channels/${panel.id}/messages/${message.id}`, { method: 'DELETE' });
await call(`/channels/${panel.id}/messages`, {
  method: 'POST',
  json: {
    embeds: [{
      color: 0x2b2d31,
      author: { name: 'KeyBind Master · Help desk' },
      title: 'Talk to the staff',
      description: 'Have a question or a problem? Pick a topic below and a **private channel** opens where only you and the staff can talk.\n\n' +
        Object.values(TYPES).map(([label, hint]) => `**${label}** — ${hint}`).join('\n') +
        '\n\n**Before you open one**\n• Update the app to the latest version\n• Sign in with Discord in the app if it is about a plan or code\n• One open ticket per person',
      footer: { text: 'We usually answer within a day.' }
    }],
    components: [{ type: 1, components: [{ type: 3, custom_id: 'kbm:ticket', placeholder: 'What do you need help with?', options: Object.entries(TYPES).map(([value, [label, hint]]) => ({ value, label, description: hint })) }] }]
  }
});
