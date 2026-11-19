# KeyBind Master bot on Cloudflare (always online, free plan)

A Durable Object keeps a Discord gateway connection open, and a cron trigger wakes it every minute so it reconnects if dropped.

## Deploy
1. `cd bot-cf`
2. `npx wrangler login`
3. `npx wrangler secret put DISCORD_BOT_TOKEN` and paste the new token.
4. `npx wrangler deploy`

Check the bot shows a green dot. Reset the token in the Developer Portal first, since the old one was shared in chat.
