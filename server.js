require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

const packages = new Set(["5000", "10000", "20000", "50000", "100000"]);

app.post("/api/demo-submit", async (req, res) => {
  const packageAmount = String(req.body?.packageAmount || "");

  if (!packages.has(packageAmount)) {
    return res.status(400).json({ error: "Choose a valid demo package." });
  }

  // Intentionally do not accept, log, store, or forward phone numbers or entered codes.
  const orderId = `DEMO-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const submittedAt = new Date().toISOString();

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Demo Store Notifications",
          embeds: [{
            title: "Demo submission received",
            color: 5793266,
            fields: [
              { name: "Demo order ID", value: orderId, inline: true },
              { name: "Selected package", value: `${Number(packageAmount).toLocaleString("en-US")} Robux (demo)`, inline: true },
              { name: "Status", value: "Demo only — not a real purchase", inline: false }
            ],
            timestamp: submittedAt,
            footer: { text: "Safe demo • No phone number or code was sent" }
          }]
        })
      });

      if (!response.ok) {
        console.error("Discord webhook returned status:", response.status);
        return res.status(502).json({ error: "Could not send the demo notification to Discord." });
      }
    } catch (error) {
      console.error("Discord notification failed:", error.message);
      return res.status(502).json({ error: "Could not reach Discord. Check your webhook configuration." });
    }
  }

  return res.json({
    ok: true,
    orderId,
    notificationConfigured: Boolean(webhookUrl),
    message: "Demo submitted. No phone number or code was sent or stored."
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Safe demo site running at http://localhost:${PORT}`);
});
