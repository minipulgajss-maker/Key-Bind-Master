import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  client.user.setPresence({
    status: 'online',
    activities: [{ name: 'key-bind-master.xyz', type: ActivityType.Watching }]
  });
});

client.login(process.env.DISCORD_BOT_TOKEN);
