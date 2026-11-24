import { call, channelIn, guilds } from './api.mjs';

const VIEW = 1n << 10n, SEND = 1n << 11n, EMBED = 1n << 14n, ATTACH = 1n << 15n, HISTORY = 1n << 16n, REACT = 1n << 6n, INVITE = 1n, MENTION_ALL = 1n << 17n, PUBLIC_THREADS = 1n << 35n, PRIVATE_THREADS = 1n << 36n, MANAGE = (1n << 4n) | (1n << 13n);
const TALK = String(VIEW | SEND | EMBED | ATTACH | HISTORY | REACT);
const READ = String(VIEW | HISTORY | REACT);
const NO_ABUSE = String(MENTION_ALL | INVITE);
const PLANS = [
  { name: 'Lite', color: 0x8fb39a, hoist: false },
  { name: 'Pro', color: 0x5b8fd6, hoist: false },
  { name: 'Max', color: 0xe8a33d, hoist: true },
  { name: 'Ultra', color: 0xd9643a, hoist: true }
];

let guild;
for (const entry of await guilds()) if (await channelIn(entry.id, 'daily-codes')) guild = entry.id;
if (!guild) throw new Error('KeyBind Master server not found');
const me = await call('/users/@me');
const roles = await call(`/guilds/${guild}/roles`);
const role = {};
for (const plan of PLANS) {
  const found = roles.find((entry) => entry.name === plan.name);
  role[plan.name] = found ?? (await call(`/guilds/${guild}/roles`, { method: 'POST', json: { name: plan.name, color: plan.color, hoist: plan.hoist, mentionable: false, permissions: '0' } }));
  if (found) await call(`/guilds/${guild}/roles/${found.id}`, { method: 'PATCH', json: { color: plan.color, hoist: plan.hoist } });
}

const bot = { id: me.id, type: 1, allow: String(VIEW | SEND | EMBED | ATTACH | HISTORY | MANAGE) };
const hidden = { id: guild, type: 0, deny: String(VIEW) };
const channels = await call(`/guilds/${guild}/channels`);
const category = channels.find((entry) => entry.type === 4 && entry.name.toLowerCase() === 'plan perks') ?? (await call(`/guilds/${guild}/channels`, { method: 'POST', json: { name: 'Plan perks', type: 4 } }));
const ensure = async (name, topic, overwrites) => {
  const found = channels.find((entry) => entry.type === 0 && entry.name === name);
  const json = { name, type: 0, parent_id: category.id, topic, permission_overwrites: [...overwrites, bot] };
  if (found) return call(`/channels/${found.id}`, { method: 'PATCH', json: { topic, parent_id: category.id, permission_overwrites: json.permission_overwrites } });
  return call(`/guilds/${guild}/channels`, { method: 'POST', json });
};
const talk = (...names) => names.map((name) => ({ id: role[name].id, type: 0, allow: TALK, deny: NO_ABUSE }));

const perks = await ensure('plans-and-perks', 'What each plan unlocks in the app and on this server.', [{ id: guild, type: 0, allow: READ, deny: String(SEND | PUBLIC_THREADS | PRIVATE_THREADS | INVITE) }]);
await ensure('max-lounge', 'Private chat for Max and Ultra members.', [hidden, ...talk('Max', 'Ultra')]);
await ensure('ultra-lounge', 'Private chat for Ultra members.', [hidden, ...talk('Ultra')]);
await ensure('early-access', 'Ultra only. News and previews before everyone else.', [hidden, { id: role.Ultra.id, type: 0, allow: READ, deny: String(SEND) }]);

const text = (content) => ({ type: 10, content });
const line = (spacing = 1) => ({ type: 14, divider: true, spacing });
const old = (await call(`/channels/${perks.id}/messages?limit=50`)) ?? [];
for (const message of old) if (message.author?.id === me.id) await call(`/channels/${perks.id}/messages/${message.id}`, { method: 'DELETE' });
await call(`/channels/${perks.id}/messages`, {
  method: 'POST',
  json: {
    flags: 1 << 15,
    components: [{
      type: 17,
      components: [
        { type: 9, components: [text('-# KeyBind Master · Plans\n## Your plan, everywhere\nSign in with Discord in the app and your plan follows you here. Your role and perks update by themselves when your plan changes or ends.')], accessory: { type: 11, media: { url: 'https://key-bind-master.xyz/img/icon.png' } } },
        line(),
        text(`<@&${role.Ultra.id}>  **Ultra** · your first 7 days\n-# Everything in Max, real-time stats, route optimization\n-# #ultra-lounge, #early-access and top priority support straight to the staff`),
        text(`<@&${role.Max.id}>  **Max**\n-# Everything in Pro, unlimited profiles, network tuning\n-# #max-lounge and priority support tickets`),
        text(`<@&${role.Pro.id}>  **Pro**\n-# Everything in Lite, Game Boost, macros, server ping check`),
        text(`<@&${role.Lite.id}>  **Lite**\n-# Shortcuts, system actions, themes, profiles, PC clean-up`),
        line(),
        text('**How to get time**\n- A free code every day in #daily-codes\n- Feedback on the website gives 3 days of Max, once a week\n- Invite a friend and you both get 7 more days'),
        line(2),
        { type: 1, components: [{ type: 2, style: 5, label: 'See the plans', url: 'https://key-bind-master.xyz/#plans' }, { type: 2, style: 5, label: 'Download', url: 'https://key-bind-master.xyz/download.html' }] }
      ]
    }],
    allowed_mentions: { parse: [] }
  }
});
