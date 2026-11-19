import { readFile } from 'node:fs/promises';
import { IS_COMPONENTS_V2, SITE, call, findChannel, send } from './api.mjs';

const CODE = 'KEY10';
const DISCOUNT = 0.1;
const money = (value) => `€${value.toFixed(2)}`;
const off = (value) => money(Math.round(value * (1 - DISCOUNT) * 100) / 100);

const [{ plans, lifetime, yearlyMonths }, version, channel, me] = await Promise.all([
  readFile('.github/discord/plans.json', 'utf8').then(JSON.parse),
  readFile('release/VERSION', 'utf8').then((text) => text.trim()),
  findChannel(process.env.DISCORD_INFO_CHANNEL || 'info', { topic: 'Everything about KeyBind Master' }),
  call('/users/@me')
]);

const planBlock = (plan) => [
  `### ${plan.name}${plan.popular ? '  ·  Most popular' : ''}`,
  `*${plan.tagline}*`,
  `**${money(plan.monthly)}** / month  ·  **${money(plan.monthly * yearlyMonths)}** / year  ·  with ${CODE}: **${off(plan.monthly)}** / month`,
  plan.perks.map((perk) => `• ${perk}`).join('\n')
].join('\n');

const payload = {
  flags: IS_COMPONENTS_V2,
  allowed_mentions: { parse: [] },
  components: [{
    type: 17,
    components: [
      { type: 10, content: `# KeyBind Master\nA fast, lightweight Windows app for global keyboard shortcuts, macros and game boost.\nLatest version: **${version}**` },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `## 🎟️ Discount code\nUse **\`${CODE}\`** for **10% off** any plan.` },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `## Plans\nFree week included. Yearly plans cost ${yearlyMonths} months, so you get 2 months free.` },
      ...plans.map((plan) => ({ type: 10, content: planBlock(plan) })),
      { type: 10, content: [`### ${lifetime.name}`, `**${money(lifetime.price)}** once  ·  with ${CODE}: **${off(lifetime.price)}**`, lifetime.perks.map((perk) => `• ${perk}`).join('\n')].join('\n') },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `Prices are a preview and may change before launch.\n🌐 ${SITE}` },
      { type: 1, components: [
        { type: 2, style: 5, label: 'Download', url: `${SITE}/download.html` },
        { type: 2, style: 5, label: 'Website', url: SITE },
        { type: 2, style: 5, label: 'Feedback', url: `${SITE}/feedback.html` }
      ] }
    ]
  }]
};

const messages = await call(`/channels/${channel.id}/messages?limit=50`);
const mine = messages.find((message) => message.author.id === me.id);
if (mine) await call(`/channels/${channel.id}/messages/${mine.id}`, { method: 'PATCH', json: payload });
else await send(channel.id, payload);
