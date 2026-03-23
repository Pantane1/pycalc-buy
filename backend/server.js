const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { Lipana } = require("@lipana/sdk");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ─── Initialize Lipana SDK ────────────────────────────────────────────────────
const lipana = new Lipana({
  apiKey: process.env.LIPANA_SECRET_KEY,
  environment: process.env.LIPANA_ENV || "sandbox", // "sandbox" | "production"
});

// ─── In-memory license store (swap with Firestore in production) ──────────────
// Structure: { "254712345678": { plan, expiresAt, transactionId } }
const licenses = {};
// Pending payments waiting for webhook: { transactionId: { phone, plan } }
const pending = {};

function isLicenseValid(phone) {
  const lic = licenses[phone];
  if (!lic) return false;
  return new Date() < new Date(lic.expiresAt);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Check license status for a phone number
app.get("/api/license/:phone", (req, res) => {
  const phone = req.params.phone.replace(/\D/g, "");
  const lic = licenses[phone];
  const valid = isLicenseValid(phone);
  res.json({
    valid,
    plan: valid ? lic.plan : null,
    expiresAt: valid ? lic.expiresAt : null,
  });
});

// Initiate STK Push via Lipana SDK
app.post("/api/pay", async (req, res) => {
  try {
    const { phone, plan } = req.body;

    if (!phone || !plan) {
      return res.status(400).json({ error: "phone and plan are required" });
    }

    // Pricing in KES  (weekly ~KES 260 / monthly ~KES 650)
    // Adjust to match your Lipana dashboard product pricing
    const amountKES = plan === "weekly" ? 260 : 650;

    // Lipana SDK call — sends STK Push to the user's phone
    const stkResponse = await lipana.transactions.initiateStkPush({
      phone,       // e.g. "+254712345678"
      amount: amountKES,
    });

    const transactionId = stkResponse.transactionId;

    // Track as pending until webhook fires
    pending[transactionId] = { phone, plan };

    console.log(`📲 STK Push → ${phone} | tx: ${transactionId} | plan: ${plan}`);

    res.json({
      success: true,
      transactionId,
      message: "STK Push sent. Check your phone and enter M-Pesa PIN.",
    });
  } catch (err) {
    console.error("STK Push error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Payment initiation failed" });
  }
});

// Lipana webhook — Lipana calls this URL when payment completes or fails
app.post("/api/lipana/webhook", (req, res) => {
  try {
    // Verify the request came from Lipana
    const signature = req.headers["x-lipana-signature"];
    const isValid = lipana.webhooks.verify(
      req.body,
      signature,
      process.env.LIPANA_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.warn("⚠️  Invalid Lipana webhook signature — rejected");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { transactionId, status, phone } = req.body;

    if (status === "success" && transactionId) {
      const pend = pending[transactionId];
      if (pend) {
        const resolvedPhone = phone || pend.phone;
        const { plan } = pend;
        const now = new Date();
        const expiresAt =
          plan === "weekly"
            ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        licenses[resolvedPhone] = { plan, expiresAt, transactionId };
        delete pending[transactionId];

        console.log(`✅ License activated → ${resolvedPhone} [${plan}] until ${expiresAt}`);
      }
    } else if (status === "failed" || status === "cancelled") {
      delete pending[transactionId];
      console.log(`❌ Payment ${status} → txId: ${transactionId}`);
    }

    res.sendStatus(200); // Always ACK to Lipana
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(200);
  }
});

// Frontend polls this every 5 seconds after STK Push is sent
app.get("/api/pay/status/:transactionId/:phone", (req, res) => {
  const { transactionId, phone } = req.params;
  const cleanPhone = phone.replace(/\s/g, "");

  const isPending = !!pending[transactionId];
  const activated = isLicenseValid(cleanPhone);

  if (activated) {
    return res.json({ status: "success", license: licenses[cleanPhone] });
  } else if (isPending) {
    return res.json({ status: "pending" });
  } else {
    return res.json({ status: "failed" });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SciCalc server → http://localhost:${PORT}`);
  console.log(`🔑 Lipana env: ${process.env.LIPANA_ENV || "sandbox"}`);
});
    
