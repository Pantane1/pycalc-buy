# SciCalc Pro — Scientific Calculator with Lipana M-Pesa Paywall

A dark cinematic scientific calculator gated behind M-Pesa payments via **Lipana.dev**.
Users pay **KES 260/week** or **KES 650/month** before the `=` button computes results.

---

## 📁 Project Structure

```
sci-calc/
├── backend/
│   ├── server.js          ← Express + @lipana/sdk STK Push & webhook
│   ├── package.json
│   └── .env.example       ← Copy to .env and fill your Lipana keys
└── frontend/
    └── index.html         ← Scientific calculator UI (served by backend)
```

---

## 🚀 Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Open `.env` and fill in your Lipana keys:

| Variable | Where to get it |
|---|---|
| `LIPANA_SECRET_KEY` | Lipana dashboard → API Keys → Secret Key |
| `LIPANA_WEBHOOK_SECRET` | Lipana dashboard → Webhooks → Webhook Secret |
| `LIPANA_ENV` | `sandbox` for testing, `production` for live |

### 3. Set your webhook URL in Lipana Dashboard
In your Lipana dashboard under **Webhooks**, set the URL to:
```
https://YOUR_DOMAIN/api/lipana/webhook
```

For local dev, expose localhost using ngrok:
```bash
npx ngrok http 3000
# Use the HTTPS URL → https://xxxx.ngrok.io/api/lipana/webhook
```

### 4. Start the server
```bash
npm run dev   # Development (auto-restart)
npm start     # Production
```

Visit → `http://localhost:3000`

---

## 💳 Payment Flow

```
User presses = → No license detected → Paywall modal opens
  ↓
User selects plan (Weekly / Monthly) + enters phone number
  ↓
Frontend POST /api/pay → server calls lipana.transactions.initiateStkPush()
  ↓
STK Push appears on user's phone → user enters M-Pesa PIN
  ↓
Lipana fires webhook → POST /api/lipana/webhook → license activated
  ↓
Frontend polls /api/pay/status/:txId/:phone every 5s
  ↓
Status = success → modal closes → calculator fully unlocked ✓
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/license/:phone` | Check if phone has active license |
| `POST` | `/api/pay` | Initiate STK Push via Lipana |
| `POST` | `/api/lipana/webhook` | Lipana payment result callback |
| `GET` | `/api/pay/status/:txId/:phone` | Poll payment result |

---

## 🧮 Calculator Features

- Trig: sin, cos, tan, asin, acos, atan — DEG/RAD/INV modes
- Logarithms: log₁₀, ln
- Powers & roots: xʸ, √
- Constants: π, e
- Factorial n!, absolute value, ceil, floor, round
- Scientific notation EXP
- Percentage, parentheses
- Full keyboard support (numbers, operators, Enter, Backspace, Escape)

---

## ⚠️ Production Notes

1. **Replace in-memory license store** with Firestore (you have it in Auto-Link v2 already)
2. **Pricing**: KES 260/week and KES 650/month are estimates — set exact amounts in your Lipana dashboard
3. **HTTPS required** for Lipana webhooks in production
4. The `@lipana/sdk` handles all auth internally — no token generation needed

---

## 🧪 Sandbox Testing

Set `LIPANA_ENV=sandbox` in `.env`.  
Use the test phone numbers and PIN from your Lipana sandbox dashboard to simulate full payment flows.
