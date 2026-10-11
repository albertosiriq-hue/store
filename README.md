# Safe demo store with Discord notifications

A clearly labeled demo storefront. It does not request names, phone numbers, passwords, verification codes, or payment details. It does not sell or deliver Robux.

## Data sent to server/Discord
Only the selected demo package is sent to the backend. The server creates a demo ID and can notify your configured Discord webhook with the ID, package, timestamp, and demo-only status.

## Run locally
1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and optionally set `DISCORD_WEBHOOK_URL`.
4. Run `npm start` and visit `http://localhost:3000`.

## Deploy to Render
1. Upload the contents of this folder to a GitHub repository (the repository root should contain `package.json`, `server.js`, `.env.example`, `README.md`, and `public/`).
2. In Render, choose New → Web Service and connect that repository.
3. Set Build Command to `npm install` and Start Command to `npm start`.
4. Add `DISCORD_WEBHOOK_URL` as an environment variable in Render's service settings; never add it to frontend files or commit `.env`.
5. Deploy. Render gives the service a public `onrender.com` URL.

## Create a Discord webhook
In your Discord server, create a private text channel visible only to you. Go to Server Settings → Integrations → Webhooks → Create Webhook, select that channel, copy the webhook URL, and set it as `DISCORD_WEBHOOK_URL` in Render. A webhook posts in a channel; it is not a bot DM. Protect the URL like a password.
