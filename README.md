# StratiQ 🌱
### AI-Powered Business Growth & Fundraising Platform

> Connect vendors with investors. Generate AI marketing plans. Grow smarter.

![StratiQ](https://img.shields.io/badge/StratiQ-AI%20Growth%20Platform-13ec13?style=for-the-badge&labelColor=0d1b0d)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase)
![Claude AI](https://img.shields.io/badge/Claude%20AI-Anthropic-blueviolet?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📌 What is StratiQ?

StratiQ is a web platform built for small business owners and startups in India. It bridges the gap between vendors who need funding and growth strategy, and investors looking for promising businesses to fund.

### The Problem
Small businesses in India struggle with two things:
- They don't know how to market and grow effectively
- They can't find the right investors to fund their ideas

### The Solution
StratiQ gives vendors an AI-powered marketing plan tailored to their exact business, and connects them with investors through a live pitch system — all in one platform.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Role-Based Auth** | Separate login flows for Vendors and Investors via Firebase |
| 🤖 **AI Growth Plan** | Claude AI generates a personalised marketing plan based on business name, type, budget & details |
| 💸 **Rise Fund** | Vendors pitch business ideas with investment needs and expected profit % |
| 📋 **Investor Dashboard** | Investors review, approve or reject pitches in real time |
| 📊 **Budget Breakdown** | AI allocates your exact budget across ad channels (Meta, Google, WhatsApp etc.) |
| 📅 **90-Day Action Plan** | Step-by-step weekly milestones specific to your business |
| 🌐 **Multilingual** | English, Tamil, and Hindi support |
| 📱 **Responsive** | Works on mobile and desktop |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Tailwind CSS, Vanilla JavaScript |
| Authentication | Firebase Auth (Email/Password) |
| Database | Cloud Firestore |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Hosting | Firebase Hosting |

---

## 🚀 Getting Started

### Prerequisites
- A Firebase project ([create one free](https://console.firebase.google.com))
- Node.js installed (for local server) OR VS Code with Live Server extension
- An Anthropic API key ([get one free](https://console.anthropic.com)) — optional, Smart Analysis works without it

### 1. Clone the repository
```bash
git clone https://github.com/NeethutBiju/StratiQ.git
cd StratiQ
```

### 2. Add your Firebase config
Open each of these files and replace the placeholders with your real Firebase config:
- `firebase.js`
- `login.html`
- `register.html`
- `dashboard.html`
- `fund.html`
- `investordashboard.html`
- `buisness-form.html`
- `script.js`

Replace:
```javascript
apiKey: "YOUR_FIREBASE_API_KEY",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID"
```

Find your config at: **Firebase Console → Project Settings → Your Apps → SDK setup**

### 3. Set up Firestore Rules
Go to **Firebase Console → Firestore Database → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /pitches/{pitchId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update: if request.auth != null;
    }
    match /business_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

### 4. Enable Firebase Authentication
Go to **Firebase Console → Authentication → Sign-in method → Email/Password → Enable**

### 5. Add Anthropic API Key (Optional)
Open `buisness-form.html` and find:
```javascript
const API_KEY = "";
```
Replace with your key:
```javascript
const API_KEY = "sk-ant-your-key-here";
```
> ⚠️ Never commit your API key to GitHub

### 6. Run locally
**Option A — VS Code Live Server (recommended)**
- Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Right-click `dashboard.html` → **Open with Live Server**
- Opens at `http://127.0.0.1:5500`

**Option B — Node.js**
```bash
node serve.js
```
Opens at `http://localhost:3000`

> ⚠️ Must use HTTP — Firebase does not work with `file://` protocol

---

## 📁 Project Structure

```
StratiQ/
├── dashboard.html          # Main landing page (vendor home)
├── login.html              # Login page
├── register.html           # Registration with Vendor / Investor role picker
├── buisness-form.html      # Business profile form + AI growth plan
├── fund.html               # Vendor pitch submission + My Pitches
├── investordashboard.html  # Investor pitch review dashboard
├── contact.html            # Contact page
├── firebase.js             # Firebase config (add your keys here)
├── auth.js                 # Login & register logic
├── script.js               # Pitch submission & Firestore loading
├── serve.js                # Local development server
├── config.example.js       # Config template — shows what keys to add
└── README.md
```

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────┐
│                      VENDOR                          │
│  Register → Dashboard → Get AI Growth Plan           │
│                       → Submit Pitch (Rise Fund)     │
│                       → View pitch status            │
└─────────────────────────────────────────────────────┘
                            ↕ Firestore
┌─────────────────────────────────────────────────────┐
│                     INVESTOR                         │
│  Register → Investor Dashboard → View all pitches    │
│                               → Approve / Reject     │
└─────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
```bash
git checkout -b feat/your-feature-name
```
3. Commit your changes
```bash
git commit -m "feat: add your feature"
```
4. Push to the branch
```bash
git push origin feat/your-feature-name
```
5. Open a Pull Request

### Commit Message Convention
| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI / styling changes |
| `refactor:` | Code restructure, no feature change |
| `docs:` | Documentation updates |
| `chore:` | Config, dependencies, cleanup |

---

## ⚠️ Security Notes

- Firebase API keys in this repo are **intentionally removed** — add your own
- Anthropic API key is **never stored in this repo** — add locally only
- Firebase API keys are safe to be public by design — security is enforced by Firestore Rules
- Never commit any `.env` files or API keys

---

## 🐛 Known Issues & Roadmap

See the [Issues](../../issues) tab for current bugs and planned features.

---

## 👩‍💻 Authors

**Neethu T Biju**
GitHub: [NeethutBiju](https://github.com/NeethutBiju)
**Iniya NJ**
GitHub: [iniyanj2025cys-ctrl](https://github.com/iniyanj2025cys-ctrl)
**Kavya Shree J**
GitHub: [kavyashreej2025cys-cyber](https://github.com/kavyashreej2025cys-cyber)
---

> *StratiQ — Democratising financial intelligence for every business in India.*