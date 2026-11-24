import { IS_COMPONENTS_V2, SITE, call, findChannel, send } from './api.mjs';

const CODE = 'KBM-9DGG-DF4P-GKTT-EE5H';
const channel = await findChannel('daily-codes');
const recent = (await call(`/channels/${channel.id}/messages?limit=50`)) ?? [];
if (recent.some((message) => JSON.stringify(message).includes(CODE))) process.exit(0);

const until = Math.floor(Date.now() / 1000) + 365 * 86400;
const message = await send(channel.id, {
  flags: IS_COMPONENTS_V2,
  allowed_mentions: { parse: [] },
  components: [{
    type: 17,
    accent_color: 0xb55233,
    components: [
      { type: 10, content: '# A special code for the community\nThank you for being part of KeyBind Master. This code lasts a whole year.' },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `## Your code\n\`\`\`\n${CODE}\n\`\`\`` },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: '## How to use it\n**1.** Open KeyBind Master and sign in with Discord.\n**2.** Go to **Your plan → Redeem a code**.\n**3.** Paste the code and enjoy.' },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `Valid for **1 year**, until <t:${until}:D>. Each Discord account can use it once.` },
      { type: 1, components: [
        { type: 2, style: 5, label: 'Download', url: `${SITE}/download.html` },
        { type: 2, style: 5, label: 'Website', url: SITE }
      ] }
    ]
  }]
});
await call(`/channels/${channel.id}/pins/${message.id}`, { method: 'PUT' });
