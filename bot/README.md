# KeyBind Master bot (always online)

Keeps the bot showing as online. Messages, the info card, moderation and the Verify button do not need this process; they run on GitHub Actions and the Cloudflare Worker.

## Setup on an Oracle Cloud Always Free Ubuntu VM
1. Create the VM (Ampere, Ubuntu 22.04 or newer) and download its SSH key.
2. Copy this folder to the VM: `scp -r bot ubuntu@<VM_IP>:~/bot`
3. Connect and run: `cd ~/bot && ./setup-vm.sh` and paste the bot token when asked.
4. Check: `pm2 status` should show `keybind-bot` as online.

Reset the token in the Developer Portal before use, since the old one was shared in chat.
