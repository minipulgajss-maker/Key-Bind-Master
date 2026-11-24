import { verifyCard } from './verify-card.mjs';
import { IS_COMPONENTS_V2, SITE, call, guilds } from './api.mjs';

const bit = (n) => 1n << BigInt(n);
const P = {
  admin: bit(3), kick: bit(1), ban: bit(2), react: bit(6), audit: bit(7), stream: bit(9), view: bit(10), send: bit(11),
  manageMessages: bit(13), embed: bit(14), attach: bit(15), history: bit(16), mentionAll: bit(17), externalEmoji: bit(18),
  connect: bit(20), speak: bit(21), mute: bit(22), deafen: bit(23), move: bit(24), nickname: bit(26), manageNicknames: bit(27),
  appCommands: bit(31), manageThreads: bit(34), publicThreads: bit(35), threadSend: bit(38), timeout: bit(40)
};
const sum = (...keys) => keys.reduce((total, key) => total | P[key], 0n).toString();

const BASE = sum('view', 'send', 'history', 'react', 'embed', 'attach', 'externalEmoji', 'connect', 'speak', 'stream', 'nickname', 'appCommands', 'threadSend');
const ROLES = [
  { name: 'Member', color: 0x99aab5, hoist: false, permissions: '0' },
  { name: 'Lite', color: 0x8fd18a, hoist: true, permissions: '0' },
  { name: 'Pro', color: 0xff9e4f, hoist: true, permissions: '0' },
  { name: 'Max', color: 0x5aa9ff, hoist: true, permissions: '0' },
  { name: 'Ultra', color: 0xc77dff, hoist: true, permissions: '0' },
  { name: 'Moderator', color: 0x3ba55d, hoist: true, permissions: sum('kick', 'ban', 'timeout', 'manageMessages', 'manageThreads', 'audit', 'mute', 'deafen', 'move', 'manageNicknames', 'mentionAll') },
  { name: 'Admin', color: 0xed4245, hoist: true, permissions: sum('admin') }
];

const CATEGORIES = [
  { key: 'start', name: '📌 Start' },
  { key: 'app', name: '🔑 KeyBind Master' },
  { key: 'community', name: '💬 Community' },
  { key: 'staff', name: '🛡️ Staff' }
];

const CHANNELS = [
  { name: 'verify', type: 0, category: 'start', access: 'verify', topic: 'Press the button to unlock the server.' },
  { name: 'info', type: 0, category: 'app', access: 'readonly', topic: 'Everything about KeyBind Master' },
  { name: 'updates', type: 0, category: 'app', access: 'readonly', topic: 'What changed in every update' },
  { name: 'shutdown', type: 0, category: 'app', access: 'readonly' },
  { name: 'general', type: 0, category: 'community', access: 'chat', topic: 'Talk about anything. Be nice.' },
  { name: 'Lobby', type: 2, category: 'community', access: 'voice' },
  { name: 'honeypot', type: 0, category: 'community', access: 'chat', topic: 'Do NOT type here. Anyone who posts here is removed from the server automatically. This channel catches scam bots.' },
  { name: 'mod-log', type: 0, category: 'staff', access: 'staff' }
];

const overwrites = (access, ids) => {
  const everyone = { id: ids.everyone, type: 0 };
  const member = { id: ids.Member, type: 0 };
  const bot = { id: ids.bot, type: 1, allow: sum('view', 'send', 'history', 'embed', 'attach', 'manageMessages'), deny: '0' };
  const staff = [ids.Moderator, ids.Admin].map((id) => ({ id, type: 0, allow: sum('view', 'send', 'history'), deny: '0' }));
  const hidden = { ...everyone, allow: '0', deny: sum('view') };
  const sets = {
    verify: [{ ...everyone, allow: sum('view', 'history'), deny: sum('send', 'react', 'publicThreads') }, { ...member, allow: '0', deny: sum('view') }],
    readonly: [hidden, { ...member, allow: sum('view', 'history', 'react'), deny: sum('send', 'publicThreads') }],
    chat: [hidden, { ...member, allow: sum('view', 'send', 'history', 'react', 'embed', 'attach', 'publicThreads', 'threadSend'), deny: sum('mentionAll') }],
    voice: [hidden, { ...member, allow: sum('view', 'connect', 'speak', 'stream'), deny: '0' }],
    staff: [hidden],
    category: [hidden, { ...member, allow: sum('view'), deny: '0' }]
  };
  return [...sets[access], ...staff, bot];
};

const upsertRoles = async (guildId) => {
  const existing = await call(`/guilds/${guildId}/roles`);
  const ids = {};
  for (const role of ROLES) {
    const found = existing.find((item) => item.name === role.name);
    const saved = found
      ? await call(`/guilds/${guildId}/roles/${found.id}`, { method: 'PATCH', json: role })
      : await call(`/guilds/${guildId}/roles`, { method: 'POST', json: role });
    ids[role.name] = saved.id;
  }
  await call(`/guilds/${guildId}/roles/${guildId}`, { method: 'PATCH', json: { permissions: BASE } });
  return ids;
};

const upsertChannel = async (guildId, all, spec) => {
  const found = all.find((item) => item.type === spec.type && item.name.toLowerCase() === spec.name.toLowerCase());
  const body = Object.fromEntries(Object.entries(spec).filter(([, value]) => value !== undefined));
  return found
    ? call(`/channels/${found.id}`, { method: 'PATCH', json: body })
    : call(`/guilds/${guildId}/channels`, { method: 'POST', json: body });
};



const me = await call('/users/@me');
for (const guild of await guilds()) {
  const roles = await upsertRoles(guild.id);
  const ids = { ...roles, everyone: guild.id, bot: me.id };
  let all = await call(`/guilds/${guild.id}/channels`);
  const parents = {};
  for (const [position, category] of CATEGORIES.entries()) {
    const saved = await upsertChannel(guild.id, all, { name: category.name, type: 4, position, permission_overwrites: overwrites(category.key === 'start' ? 'verify' : category.key === 'staff' ? 'staff' : 'category', ids) });
    parents[category.key] = saved.id;
  }
  all = await call(`/guilds/${guild.id}/channels`);
  const made = {};
  for (const [position, spec] of CHANNELS.entries()) {
    const saved = await upsertChannel(guild.id, all, { name: spec.name, type: spec.type, topic: spec.topic, position, parent_id: parents[spec.category], permission_overwrites: overwrites(spec.access, ids), rate_limit_per_user: spec.access === 'chat' ? 3 : undefined });
    made[spec.name] = saved.id;
  }
  await call(`/guilds/${guild.id}`, { method: 'PATCH', json: { verification_level: 2, explicit_content_filter: 2, default_message_notifications: 1 } });
  const messages = await call(`/channels/${made.verify}/messages?limit=20`);
  const mine = messages.find((message) => message.author.id === me.id);
  if (mine) await call(`/channels/${made.verify}/messages/${mine.id}`, { method: 'PATCH', json: verifyCard });
  else await call(`/channels/${made.verify}/messages`, { method: 'POST', json: verifyCard });
}
