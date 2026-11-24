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
const text = (content) => ({ type: 10, content });
const line = (spacing = 1) => ({ type: 14, divider: true, spacing });
await call(`/channels/${panel.id}/messages`, {
  method: 'POST',
  json: {
    flags: 1 << 15,
    components: [{
      type: 17,
      components: [
        { type: 9, components: [text('-# KeyBind Master · Help desk\n## Need a hand?\nPick a topic below and a **private channel** opens where only you and the staff can talk. Our assistant answers in seconds, in any language.')], accessory: { type: 11, media: { url: 'https://key-bind-master.xyz/img/icon.png' } } },
        line(),
        text(Object.values(TYPES).map(([label, hint]) => `**${label}**\n-# ${hint}`).join('\n')),
        line(),
        text('**Before you open one**\n- Update the app to the latest version\n- Sign in with Discord in the app for plan or code questions\n- One open ticket per person'),
        line(2),
        { type: 1, components: [{ type: 3, custom_id: 'kbm:ticket', placeholder: 'Choose a topic', options: Object.entries(TYPES).map(([value, [label, hint]]) => ({ value, label, description: hint })) }] },
        text('-# Max and Ultra members get priority support · We usually answer within a day')
      ]
    }]
  }
});
