const API = 'https://discord.com/api/v10';
const TOKEN = process.env.DISCORD_TOKEN;

export const SITE = 'https://key-bind-master.xyz';
export const IS_COMPONENTS_V2 = 1 << 15;

export const call = async (path, init = {}) => {
  const headers = { Authorization: `Bot ${TOKEN}`, ...init.headers };
  if (init.json) {
    headers['Content-Type'] = 'application/json';
    init = { ...init, body: JSON.stringify(init.json) };
  }
  const response = await fetch(`${API}${path}`, { ...init, headers });
  if (response.status === 429) {
    const { retry_after } = await response.json();
    await new Promise((resolve) => setTimeout(resolve, retry_after * 1000));
    return call(path, init);
  }
  if (!response.ok) throw new Error(`${init.method ?? 'GET'} ${path} ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
};

export const guilds = () => call('/users/@me/guilds');

export const channelIn = async (guildId, name, create) => {
  const channels = await call(`/guilds/${guildId}/channels`);
  const found = channels.find((item) => item.type === 0 && item.name === name);
  if (found || !create) return found;
  return call(`/guilds/${guildId}/channels`, { method: 'POST', json: { name, type: 0, ...create } });
};

export const findChannel = async (name, create) => {
  for (const guild of await guilds()) {
    const channel = await channelIn(guild.id, name, create);
    if (channel) return channel;
  }
  throw new Error(`No #${name} channel`);
};

export const send = (channelId, payload, files = []) => {
  if (!files.length) return call(`/channels/${channelId}/messages`, { method: 'POST', json: payload });
  const form = new FormData();
  form.append('payload_json', JSON.stringify(payload));
  files.forEach(({ name, data }, index) => form.append(`files[${index}]`, new Blob([data], { type: 'image/png' }), name));
  return call(`/channels/${channelId}/messages`, { method: 'POST', body: form });
};
