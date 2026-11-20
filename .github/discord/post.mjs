import { readFile } from 'node:fs/promises';
import { IS_COMPONENTS_V2, SITE, findChannel, send } from './api.mjs';

const parseNotes = (text) => {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const title = lines.find((line) => !line.startsWith('-'))?.replace(/^#+\s*/, '') ?? 'New update';
  const items = lines.filter((line) => line.startsWith('-')).map((line) => `• ${line.replace(/^-\s*/, '')}`);
  return { title, items };
};

const [version, notes, banner, bar, channel] = await Promise.all([
  readFile('release/VERSION', 'utf8').then((text) => text.trim()),
  readFile('release/NOTES.md', 'utf8').then(parseNotes),
  readFile('.github/discord/banner.png'),
  readFile('.github/discord/bar.png'),
  findChannel(process.env.DISCORD_CHANNEL_NAME || 'updates')
]);

await send(channel.id, {
  flags: IS_COMPONENTS_V2,
  allowed_mentions: { parse: [] },
  attachments: [{ id: 0, filename: 'banner.png' }, { id: 1, filename: 'bar.png' }],
  components: [{
    type: 17,
    components: [
      { type: 12, items: [{ media: { url: 'attachment://banner.png' } }] },
      { type: 10, content: `## KeyBind Master Alpha\n**${notes.title}**` },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `### What's new\n${notes.items.join('\n')}` },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: `The app updates itself on next launch, or grab it from the website.\n🌐 ${SITE}` },
      { type: 1, components: [
        { type: 2, style: 5, label: 'Download', url: `${SITE}/download.html` },
        { type: 2, style: 5, label: 'Website', url: SITE }
      ] },
      { type: 12, items: [{ media: { url: 'attachment://bar.png' } }] }
    ]
  }]
}, [{ name: 'banner.png', data: banner }, { name: 'bar.png', data: bar }]);
