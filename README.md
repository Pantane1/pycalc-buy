# SciCalc Pro

<div align="center">

![SciCalc Pro](https://img.shields.io/badge/SciCalc-Pro-c8ff00?style=for-the-badge&labelColor=0d1117)
![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge&labelColor=0d1117)
![Node](https://img.shields.io/badge/Node.js-25.x-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=0d1117)
![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel&labelColor=0d1117)
![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&labelColor=0d1117)

**A dark cinematic scientific calculator gated behind M-Pesa payments via Lipana.dev**

[🚀 Live Demo](https://pycalc-buy.vercel.app) · [📦 Backend](https://pycalc-buy.onrender.com) · [🐛 Report Bug](https://github.com/Pantane1/pycalc-buy/issues)

</div>

---

## ✨ Overview

SciCalc Pro is a fully functional scientific calculator with a built-in M-Pesa paywall. Users must purchase a license via STK Push before the `=` button computes any result. Once paid, the calculator unlocks for the duration of their plan.

Built with a dark cinematic aesthetic — electric lime accents, JetBrains Mono typography, and smooth animations.

---

## 📸 Preview

| Calculator | Paywall Modal |
|---|---|
| Dark UI with full scientific functions | M-Pesa STK Push plan selector |

---

## 💳 Payment Flow

```
User types calculation → presses = → no license → paywall modal opens
        ↓
Selects plan (Weekly / Monthly) + enters phone number
        ↓
Backend sends STK Push via Lipana.dev → user enters M-Pesa PIN
        ↓
Lipana webhook fires → license activated server-side
        ↓
Frontend polls every 5s → detects success → calculator unlocks ✅
```

---

## 🧮 Calculator Features

- **Trigonometry** — sin, cos, tan, asin, acos, atan
- **Angle modes** — DEG / RAD / INV toggle
- **Logarithms** — log₁₀, ln
- **Powers & roots** — xʸ, √
- **Constants** — π, e
- **Extra functions** — n!, |x|, ⌈x⌉, ⌊x⌋, round, %
- **Scientific notation** — EXP
- **Keyboard support** — numbers, operators, Enter, Backspace, Escape
- **Mobile responsive** — works on any screen size

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Payments | Lipana.dev (`@lipana/sdk`) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | GitHub |

---

## 📁 Project Structure

```
pycalc-buy/
├── backend/
│   ├── server.js          ← Express API + Lipana STK Push & webhook
│   ├── package.json
│   ├── railway.json       ← Railway deploy config (optional)
│   └── .env.example       ← Environment variable template
├── frontend/
│   ├── index.html         ← Full calculator UI
│   ├── favicon.ico        ← App favicon
│   └── vercel.json        ← Vercel deploy config
├── SECURITY.md
├── PRIVACY.md
├── CHANGELOG.md
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- A [Lipana.dev](https://lipana.dev) account with API keys

### 1. Clone the repo
```bash
git clone https://github.com/Pantane1/pycalc-buy.git
cd pycalc-buy/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `LIPANA_SECRET_KEY` | Lipana dashboard → API Keys → Secret Key |
| `LIPANA_WEBHOOK_SECRET` | Lipana dashboard → Webhooks → Secret |
| `LIPANA_ENV` | `sandbox` for testing, `production` for live |
| `PORT` | Server port (default: 3000) |

### 4. Start the server
```bash
npm run dev
```

Visit → `http://localhost:3000`

---

## 🌍 Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect `pycalc-buy` repo → set Root Directory to `backend`
3. Build Command: `npm install` · Start Command: `node server.js`
4. Add environment variables from `.env`
5. Deploy → copy your Render URL

### Frontend → Vercel
1. Update `const API = "https://your-render-url.onrender.com"` in `frontend/index.html`
2. Go to [vercel.com](https://vercel.com) → New Project → import repo
3. Set Root Directory to `frontend`
4. Deploy → live at `https://pycalc-buy.vercel.app`

### Webhook
In your Lipana dashboard set webhook URL to:
```
https://pycalc-buy.onrender.com/api/lipana/webhook
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/license/:phone` | Check active license |
| `POST` | `/api/pay` | Initiate STK Push |
| `POST` | `/api/lipana/webhook` | Lipana payment callback |
| `GET` | `/api/pay/status/:txId/:phone` | Poll payment result |

---

## 🛡️ Security

See [SECURITY.md](./SECURITY.md) for the vulnerability reporting policy.

All payment processing is handled by Lipana.dev. No card or PIN data ever touches this server. Webhook payloads are verified via `x-lipana-signature` before processing.

---

## 📜 License

Distributed under the Apache 2.0 License. See [LICENSE](./LICENSE) for more information.

---

## 👤 Author

**Wamuhu Martin** (Pantane1)

- Portfolio: [wamuhu-martin.vercel.app](https://wamuhu-martin.vercel.app)
- Designs: [pantane1.github.io/Designs.](https://pantane1.github.io/Designs./)
- GitHub: [@Pantane1](https://github.com/Pantane1)

---

<div align="center">
Made in Nairobi 🇰🇪 · Powered by M-Pesa
</div>
