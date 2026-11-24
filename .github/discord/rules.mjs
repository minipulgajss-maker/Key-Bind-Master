import { call, guilds, SITE } from './api.mjs';

const VIEW = 1n << 10n, SEND = 1n << 11n, HISTORY = 1n << 16n, REACT = 1n << 6n, THREADS = (1n << 35n) | (1n << 36n), MANAGE = (1n << 4n) | (1n << 13n), EMBED = 1n << 14n;
const text = (content) => ({ type: 10, content });
const line = (spacing = 1) => ({ type: 14, divider: true, spacing });
const RULES = [
  ['Respect everyone', 'Treat every member and the staff with respect. No insults, harassment, hate speech, discrimination or threats.'],
  ['Keep it safe for all ages', 'No NSFW, gore, shocking or illegal content, in messages, names, avatars or links.'],
  ['No spam or advertising', 'No flooding, mass mentions, chain messages, self promotion or invite links without staff approval.'],
  ['No scams or malicious links', 'No phishing, fake giveaways, "free nitro", token grabbers or cracked software. Sharing them gets you removed.'],
  ['Protect your account', 'Never share your password, token or codes. The staff will never DM you first asking for them.'],
  ['No cheating or exploits', 'Do not ask for or share cheats, hacks, cracks or ways to abuse the app, codes or invites.'],
  ['Use the right channel', 'Keep topics where they belong. Questions and problems go to a private ticket in #tickets.'],
  ['English in public channels', 'So everyone can follow and the staff can moderate. Tickets and the assistant work in any language.'],
  ['Follow the staff', 'Moderators have the final say. If you disagree with a decision, open a ticket instead of arguing in chat.'],
  ['Follow Discord rules', 'The Discord Terms of Service and Community Guidelines always apply, including the minimum age.']
];

for (const guild of await guilds()) {
  const channels = await call(`/guilds/${guild.id}/channels`);
  const verify = channels.find((entry) => entry.type === 0 && entry.name === 'verify');
  if (!verify) continue;
  const me = await call('/users/@me');
  const roles = await call(`/guilds/${guild.id}/roles`);
  const member = roles.find((role) => role.name === 'Member');
  let rules = channels.find((entry) => entry.type === 0 && entry.name === 'rules');
  const overwrites = [
    { id: guild.id, type: 0, allow: String(VIEW | HISTORY), deny: String(SEND | THREADS | REACT) },
    { id: me.id, type: 1, allow: String(VIEW | SEND | HISTORY | EMBED | MANAGE) }
  ];
  if (!rules) rules = await call(`/guilds/${guild.id}/channels`, { method: 'POST', json: { name: 'rules', type: 0, parent_id: verify.parent_id, position: verify.position + 1, topic: 'Server rules. Breaking them can lead to a warning, a timeout or a ban.', permission_overwrites: overwrites } });
  const trap = channels.find((entry) => entry.type === 0 && entry.name === 'honeypot');
  if (trap) await call(`/channels/${trap.id}`, { method: 'PATCH', json: { topic: 'Do NOT type here. Anyone who posts here is removed from the server automatically. This channel catches scam bots.' } }).catch(() => null);
  const old = (await call(`/channels/${rules.id}/messages?limit=50`)) ?? [];
  for (const message of old) if (message.author?.id === me.id) await call(`/channels/${rules.id}/messages/${message.id}`, { method: 'DELETE' });
  await call(`/channels/${rules.id}/messages`, {
    method: 'POST',
    json: {
      flags: 1 << 15,
      allowed_mentions: { parse: [] },
      components: [{
        type: 17,
        components: [
          { type: 9, components: [text('-# KeyBind Master · Community\n## Server rules\nThese rules keep the server friendly and safe. By staying here you agree to follow them.')], accessory: { type: 11, media: { url: `${SITE}/img/icon.png` } } },
          line(),
          text(RULES.map(([title, body], index) => `**${index + 1}. ${title}**\n-# ${body}`).join('\n')),
          line(),
          text('**What happens if you break them**\n-# A warning, then a timeout, then a ban. Scams, raids and posting in the trap channel lead to instant removal. The staff can act without warning in serious cases.'),
          line(2),
          { type: 1, components: [{ type: 2, style: 5, label: 'Terms', url: `${SITE}/terms.html` }, { type: 2, style: 5, label: 'Discord Guidelines', url: 'https://discord.com/guidelines' }] },
          text(`-# Need help or want to report someone? Open a ticket in #tickets.`)
        ]
      }]
    }
  });
}
