import { readFile } from 'node:fs/promises';

const API = 'https://discord.com/api/v10';
const SITE = 'https://key-bind-master.xyz';
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_NAME = process.env.DISCORD_CHANNEL_NAME || 'updates';
const ACCENT = 0xff9e4f;
const IS_COMPONENTS_V2 = 1 << 15;

const call = async (path, init = {}) => {
  const response = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Bot ${TOKEN}`, ...init.headers } });
  if (!response.ok) throw new Error(`${path} ${response.status} ${await response.text()}`);
  return response.json();
};

const findChannel = async () => {
  if (process.env.DISCORD_CHANNEL_ID) return process.env.DISCORD_CHANNEL_ID;
  const guilds = await call('/users/@me/guilds');
  const lists = await Promise.all(guilds.map((guild) => call(`/guilds/${guild.id}/channels`)));
  const channel = lists.flat().find((item) => item.type === 0 && item.name === CHANNEL_NAME);
  if (!channel) throw new Error(`No #${CHANNEL_NAME} channel`);
  return channel.id;
};

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
  findChannel()
]);

const payload = {
  flags: IS_COMPONENTS_V2,
  allowed_mentions: { parse: [] },
  attachments: [{ id: 0, filename: 'banner.png' }, { id: 1, filename: 'bar.png' }],
  components: [{
    type: 17,
    accent_color: ACCENT,
    components: [
      { type: 12, items: [{ media: { url: 'attachment://banner.png' } }] },
      { type: 10, content: `## KeyBind Master ${version}\n**${notes.title}**` },
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
};

const form = new FormData();
form.append('payload_json', JSON.stringify(payload));
form.append('files[0]', new Blob([banner], { type: 'image/png' }), 'banner.png');
form.append('files[1]', new Blob([bar], { type: 'image/png' }), 'bar.png');
await call(`/channels/${channel}/messages`, { method: 'POST', body: form });
