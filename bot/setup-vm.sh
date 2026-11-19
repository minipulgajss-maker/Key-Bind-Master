#!/usr/bin/env bash
set -euo pipefail
sudo apt-get update -y
sudo apt-get install -y curl git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo mkdir -p /opt/keybind-bot
sudo chown "$USER":"$USER" /opt/keybind-bot
cp package.json index.js /opt/keybind-bot/
cd /opt/keybind-bot && npm install --omit=dev
read -rsp "Paste DISCORD_BOT_TOKEN (hidden): " token; echo
printf 'DISCORD_BOT_TOKEN=%s\n' "$token" > /opt/keybind-bot/.env
chmod 600 /opt/keybind-bot/.env
pm2 start index.js --name keybind-bot --node-args="--env-file=/opt/keybind-bot/.env"
pm2 save
pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | sudo bash
