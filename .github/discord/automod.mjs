import { call, channelIn, guilds } from './api.mjs';

const BLOCK = { type: 1, metadata: { custom_message: 'Message blocked by KeyBind Master moderation.' } };
const alert = (channelId) => ({ type: 2, metadata: { channel_id: channelId } });
const timeout = (seconds) => ({ type: 3, metadata: { duration_seconds: seconds } });

const rules = (log, trap, others, staff) => [
  { name: 'KBM · Honeypot', event_type: 1, trigger_type: 1, trigger_metadata: { regex_patterns: ['[\\s\\S]'], allow_list: [] }, actions: [BLOCK, alert(log), timeout(2419200)], exempt_channels: others, exempt_roles: staff },
  { name: 'KBM · Spam', event_type: 1, trigger_type: 3, actions: [BLOCK, alert(log)], exempt_roles: staff },
  { name: 'KBM · Mass mentions', event_type: 1, trigger_type: 5, trigger_metadata: { mention_total_limit: 5, mention_raid_protection_enabled: true }, actions: [BLOCK, alert(log), timeout(3600)] },
  { name: 'KBM · Bad words', event_type: 1, trigger_type: 4, trigger_metadata: { presets: [1, 2, 3], allow_list: [] }, actions: [BLOCK, alert(log)] },
  {
    name: 'KBM · Scams and invites',
    event_type: 1,
    trigger_type: 1,
    trigger_metadata: {
      regex_patterns: [
        '(discord\\.(gg|io|me|li)|discord(app)?\\.com/invite)/[a-z0-9-]+',
        'free\\s*(discord\\s*)?nitro',
        'n[i1!]tr[o0].{0,12}(gift|free|claim)',
        'free\\s*(robux|v-?bucks|skins?)',
        '(steam|disc[o0]rd)[a-z]{0,6}\\.(ru|tk|ml|ga|cf|gq|xyz)',
        '(grabify|iplogger|blasze|2no\\.co|yip\\.su)',
        'bit\\.ly|tinyurl\\.com|cutt\\.ly|shorturl\\.at'
      ],
      allow_list: ['discord.gg/keybind', 'key-bind-master.xyz']
    },
    actions: [BLOCK, alert(log), timeout(86400)]
  },
  {
    name: 'KBM · Insults (multi-language)',
    event_type: 1,
    trigger_type: 1,
    trigger_metadata: {
      keyword_filter: ['*fdp*', '*filho da puta*', '*caralho*', '*porra*', '*merda*', '*puta*', '*crl*', '*vsf*', '*foda-se*', '*hijo de puta*', '*gilipollas*', '*pendejo*', '*cabron*', '*mierda*', '*hurensohn*', '*scheisse*', '*arschloch*', '*kys*', '*kill yourself*', '*retard*'],
      allow_list: []
    },
    actions: [BLOCK, alert(log), timeout(600)]
  }
];

for (const guild of await guilds()) {
  const log = await channelIn(guild.id, 'mod-log', { permission_overwrites: [{ id: guild.id, type: 0, deny: '1024' }] });
  const [existing, channels, roles] = await Promise.all([
    call(`/guilds/${guild.id}/auto-moderation/rules`),
    call(`/guilds/${guild.id}/channels`),
    call(`/guilds/${guild.id}/roles`)
  ]);
  const trap = channels.find((item) => item.name === 'honeypot');
  const others = channels.filter((item) => item.id !== trap?.id && [0, 2, 5, 13, 15].includes(item.type)).map((item) => item.id).slice(0, 50);
  const staff = roles.filter((role) => ['Admin', 'Moderator'].includes(role.name)).map((role) => role.id);
  const wanted = rules(log.id, trap, others, staff).filter((rule) => trap || rule.name !== 'KBM · Honeypot');
  for (const rule of wanted) {
    const current = existing.find((item) => item.name === rule.name);
    const body = { ...rule, enabled: true };
    if (current) await call(`/guilds/${guild.id}/auto-moderation/rules/${current.id}`, { method: 'PATCH', json: { ...body, trigger_type: undefined } });
    else await call(`/guilds/${guild.id}/auto-moderation/rules`, { method: 'POST', json: body });
  }
}
