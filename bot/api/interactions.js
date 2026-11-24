import { waitUntil } from '@vercel/functions';

const OWNER = '1101959939263574048';
const API = 'https://discord.com/api/v10';
const TYPES = {
  bug: { label: 'Bug or crash', color: 0xd9534f },
  plan: { label: 'Plan or account', color: 0x8e5bd9 },
  codes: { label: 'Codes and gifts', color: 0xe8a33d },
  boost: { label: 'Boost and ping', color: 0x3d8be8 },
  idea: { label: 'Idea or suggestion', color: 0x3dbf7a },
  other: { label: 'Something else', color: 0x8a7a70 }
};
const PRIORITIES = { low: 'Low', normal: 'Normal', high: 'High' };
const VIEW = 1024n, SEND = 2048n, EMBED = 16384n, ATTACH = 32768n, HISTORY = 65536n, MANAGE_CHANNELS = 16n, MANAGE_MESSAGES = 8192n, ADMINISTRATOR = 8n;
const MEMBER_ALLOW = String(VIEW | SEND | EMBED | ATTACH | HISTORY);
const BOT_ALLOW = String(VIEW | SEND | EMBED | ATTACH | HISTORY | MANAGE_CHANNELS | MANAGE_MESSAGES);
const NEUTRAL = 0x242429;
const EPOCH = 1420070400000n;

const env = (name) => process.env[name] ?? '';
const json = (data) => Response.json(data);
const reply = (content, components = []) => json({ type: 4, data: { flags: 64, content, components } });
const button = (custom_id, label, style) => ({ type: 2, custom_id, label, style });
const unhex = (hex) => Uint8Array.from(hex.match(/../g) ?? [], (byte) => parseInt(byte, 16));
const clean = (value, max) => String(value ?? '').replace(/@(everyone|here)/g, '@​$1').trim().slice(0, max);
const isStaff = (member) => member?.user?.id === OWNER || (BigInt(member?.permissions ?? '0') & ADMINISTRATOR) === ADMINISTRATOR;

async function discord(method, path, body) {
  const response = await fetch(API + path, {
    method,
    headers: { Authorization: `Bot ${env('DISCORD_BOT_TOKEN')}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.status === 204 ? null : response.json();
}

async function verify(request, body) {
  try {
    const key = await crypto.subtle.importKey('raw', unhex(env('DISCORD_PUBLIC_KEY')), { name: 'Ed25519' }, false, ['verify']);
    const timestamp = request.headers.get('x-signature-timestamp') ?? '';
    return await crypto.subtle.verify({ name: 'Ed25519' }, key, unhex(request.headers.get('x-signature-ed25519') ?? ''), new TextEncoder().encode(timestamp + body));
  } catch {
    return false;
  }
}

async function ticketChannels(guild) {
  const channels = await discord('GET', `/guilds/${guild}/channels`);
  return { channels, tickets: channels.filter((channel) => channel.type === 0 && /^ticket-\d+/.test(channel.name)) };
}

function openFor(tickets, userId) {
  return tickets.find((channel) => channel.topic?.includes(`uid:${userId}`) && channel.permission_overwrites?.some((entry) => entry.id === userId && (BigInt(entry.allow) & SEND) === SEND));
}

function modal(kind) {
  const field = (custom_id, label, style, required, placeholder, max) => ({ type: 1, components: [{ type: 4, custom_id, label, style, required, placeholder, max_length: max }] });
  return json({ type: 9, data: {
    custom_id: `kbm:tm:${kind}`,
    title: TYPES[kind].label,
    components: [
      field('subject', 'Short title', 1, true, 'Boost does not start for Valorant', 80),
      field('details', 'What happened?', 2, true, 'Tell us what you did, what you expected and what happened instead.', 1500),
      field('steps', 'Steps to see it (optional)', 2, false, '1. Open Boost\n2. Pick Valorant\n3. Press Start', 600),
      field('version', 'App version / Windows (optional)', 1, false, 'V1.0.0 · Windows 11', 60),
      field('priority', 'How urgent? low, normal or high', 1, false, 'normal', 6)
    ]
  } });
}

async function openTicket(interaction) {
  const guild = interaction.guild_id;
  const user = interaction.member.user;
  const kind = interaction.data.custom_id.split(':')[2];
  const type = TYPES[kind] ?? TYPES.other;
  const values = Object.fromEntries(interaction.data.components.flatMap((row) => row.components).map((input) => [input.custom_id, clean(input.value, 1500)]));
  const priority = PRIORITIES[(values.priority || 'normal').toLowerCase()] ?? 'Normal';
  const { channels, tickets } = await ticketChannels(guild);
  const existing = openFor(tickets, user.id);
  if (existing) return existing.id;
  const category = channels.find((channel) => channel.type === 4 && channel.name.toLowerCase() === 'help desk');
  const number = tickets.reduce((max, channel) => Math.max(max, Number(channel.name.split('-')[1]) || 0), 0) + 1;
  const name = `ticket-${String(number).padStart(4, '0')}-${user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 90);
  const channel = await discord('POST', `/guilds/${guild}/channels`, {
    name, type: 0, parent_id: category?.id, topic: `Ticket #${number} · ${type.label} · ${values.subject} · uid:${user.id}`.slice(0, 1024),
    permission_overwrites: [
      { id: guild, type: 0, deny: String(VIEW) },
      { id: user.id, type: 1, allow: MEMBER_ALLOW },
      { id: interaction.application_id, type: 1, allow: BOT_ALLOW },
      { id: OWNER, type: 1, allow: MEMBER_ALLOW }
    ]
  });
  const created = (BigInt(user.id) >> 22n) + EPOCH;
  await discord('POST', `/channels/${channel.id}/messages`, {
    content: `<@${user.id}> <@${OWNER}>`,
    allowed_mentions: { users: [user.id, OWNER] },
    embeds: [
      {
        color: type.color,
        author: { name: `${user.global_name ?? user.username} · Ticket #${number}`, icon_url: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : undefined },
        title: values.subject,
        description: values.details,
        fields: [
          { name: 'Category', value: type.label, inline: true },
          { name: 'Priority', value: priority, inline: true },
          { name: 'Status', value: 'Waiting for the staff', inline: true },
          ...(values.steps ? [{ name: 'Steps to see it', value: values.steps.slice(0, 1024) }] : []),
          { name: 'App / Windows', value: values.version || 'Not given', inline: true },
          { name: 'Discord account', value: `<t:${Number(created / 1000n)}:D>`, inline: true }
        ],
        footer: { text: `Opened by ${user.username}` },
        timestamp: new Date().toISOString()
      },
      { color: NEUTRAL, description: '**Thanks!** The staff has been told. While you wait, add screenshots or a short video here, they help a lot.\nPress **Close** when it is solved.' }
    ],
    components: [{ type: 1, components: [button(`kbm:tclaim:${user.id}`, 'Claim', 1), button(`kbm:tclose:${user.id}`, 'Close', 4)] }]
  });
  return channel.id;
}

async function handle(interaction) {
  const id = interaction.data?.custom_id ?? '';
  const member = interaction.member;
  if (id === 'kbm:verify') {
    const done = await discord('PUT', `/guilds/${interaction.guild_id}/members/${member.user.id}/roles/${env('DISCORD_MEMBER_ROLE_ID')}`).then(() => true, () => false);
    return reply(done ? 'You are verified. Welcome to the server!' : 'Verification failed. Try again in a moment.');
  }
  if (id === 'kbm:ticket') {
    const kind = interaction.data.values?.[0];
    if (!TYPES[kind]) return reply('Pick one of the options.');
    const { tickets } = await ticketChannels(interaction.guild_id);
    const open = openFor(tickets, member.user.id);
    if (open) return reply(`You already have an open ticket: <#${open.id}>. Close it first to open a new one.`);
    return modal(kind);
  }
  if (id.startsWith('kbm:tm:')) {
    waitUntil((async () => {
      let text;
      try {
        text = `Your ticket is ready: <#${await openTicket(interaction)}>`;
      } catch {
        text = 'Could not open the ticket. Try again in a minute.';
      }
      await fetch(`${API}/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: text }) });
    })());
    return json({ type: 5, data: { flags: 64 } });
  }
  const [, action, owner] = id.split(':');
  const channel = interaction.channel_id;
  if (action === 'tclaim') {
    if (!isStaff(member)) return reply('Only the staff can claim tickets.');
    return json({ type: 4, data: { embeds: [{ color: 0x3dbf7a, description: `<@${member.user.id}> is now helping with this ticket. Status: **In progress**.` }], allowed_mentions: { parse: [] } } });
  }
  if (action === 'tclose') {
    if (!isStaff(member) && member.user.id !== owner) return reply('Only the person who opened it or the staff can close it.');
    return reply('Close this ticket? You will not be able to write in it anymore.', [{ type: 1, components: [button(`kbm:tcloseyes:${owner}`, 'Yes, close it', 4)] }]);
  }
  if (action === 'tcloseyes') {
    if (!isStaff(member) && member.user.id !== owner) return reply('Not allowed.');
    await discord('PUT', `/channels/${channel}/permissions/${owner}`, { type: 1, allow: String(VIEW | HISTORY), deny: String(SEND) });
    await discord('POST', `/channels/${channel}/messages`, {
      embeds: [{ color: 0x8a7a70, title: 'Ticket closed', description: `Closed by <@${member.user.id}> <t:${Math.floor(Date.now() / 1000)}:R>.\nThanks for reaching out! You can open a new ticket in the tickets channel any time.` }],
      allowed_mentions: { parse: [] },
      components: [{ type: 1, components: [button(`kbm:treopen:${owner}`, 'Reopen', 2), button(`kbm:tdelete:${owner}`, 'Delete', 4)] }]
    });
    return reply('Ticket closed.');
  }
  if (action === 'treopen') {
    if (!isStaff(member)) return reply('Only the staff can reopen tickets.');
    await discord('PUT', `/channels/${channel}/permissions/${owner}`, { type: 1, allow: MEMBER_ALLOW });
    return json({ type: 4, data: { embeds: [{ color: 0x3d8be8, description: `Ticket reopened by <@${member.user.id}>.` }], allowed_mentions: { parse: [] } } });
  }
  if (action === 'tdelete') {
    if (!isStaff(member)) return reply('Only the staff can delete tickets.');
    waitUntil(discord('DELETE', `/channels/${channel}`).catch(() => null));
    return reply('Deleting this ticket...');
  }
  return reply('Unknown action.');
}

export async function POST(request) {
  const body = await request.text();
  if (!(await verify(request, body))) return new Response('Bad signature.', { status: 401 });
  const interaction = JSON.parse(body);
  if (interaction.type === 1) return json({ type: 1 });
  try {
    return await handle(interaction);
  } catch {
    return reply('Something went wrong. Try again in a moment.');
  }
}

export function GET() {
  return new Response('KeyBind Master bot is online.');
}
