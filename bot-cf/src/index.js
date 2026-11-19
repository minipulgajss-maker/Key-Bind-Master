const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';
const PRESENCE = { since: null, afk: false, status: 'online', activities: [{ name: 'key-bind-master.xyz', type: 3 }] };

export class Gateway {
  constructor(state, env) {
    this.env = env;
    this.socket = null;
    this.sequence = null;
    this.timer = null;
  }

  async fetch() {
    if (!this.socket || this.socket.readyState !== 1) await this.connect();
    return new Response('ok');
  }

  async connect() {
    clearInterval(this.timer);
    const response = await fetch(GATEWAY_URL, { headers: { Upgrade: 'websocket' } });
    const socket = response.webSocket;
    if (!socket) return;
    socket.accept();
    this.socket = socket;
    this.sequence = null;
    socket.addEventListener('message', (event) => this.receive(event.data));
    socket.addEventListener('close', () => this.drop());
    socket.addEventListener('error', () => this.drop());
  }

  drop() {
    clearInterval(this.timer);
    this.socket = null;
  }

  receive(raw) {
    const payload = JSON.parse(raw);
    if (payload.s != null) this.sequence = payload.s;
    if (payload.op === 10) {
      this.timer = setInterval(() => this.send({ op: 1, d: this.sequence }), payload.d.heartbeat_interval);
      this.send({
        op: 2,
        d: {
          token: this.env.DISCORD_BOT_TOKEN,
          intents: 0,
          properties: { os: 'cloudflare', browser: 'worker', device: 'worker' },
          presence: PRESENCE
        }
      });
    }
    if (payload.op === 1) this.send({ op: 1, d: this.sequence });
    if (payload.op === 7 || payload.op === 9) this.socket?.close();
  }

  send(data) {
    if (this.socket?.readyState === 1) this.socket.send(JSON.stringify(data));
  }
}

export default {
  async fetch() {
    return new Response('KeyBind Master bot is running.');
  },
  async scheduled(event, env) {
    await env.GATEWAY.get(env.GATEWAY.idFromName('main')).fetch('https://gateway/ensure');
  }
};
