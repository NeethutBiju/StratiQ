# StratiQ 🌱
### AI-Powered Business Growth & Fundraising Platform

> Connect vendors with investors. Generate AI marketing plans. Grow smarter.

![StratiQ Banner](https://img.shields.io/badge/StratiQ-AI%20Growth%20Platform-13ec13?style=for-the-badge&labelColor=0d1b0d)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase)
![Claude AI](https://img.shields.io/badge/Claude%20AI-Anthropic-blueviolet?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 🚀 What is StratiQ?

StratiQ is a web platform that helps small business owners and startups in India:

- 📊 **Generate AI-powered marketing plans** tailored to their business name, budget, type, and goals
- 💰 **Submit fundraising pitches** to attract real investors
- 🤝 **Connect vendors and investors** through a live pitch review system
- 📈 **Get actionable growth strategies** with budget breakdowns, ad channel recommendations, and 90-day action plans

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth System** | Firebase Email/Password login & registration with role-based access |
| 👤 **Two Roles** | Vendor (submit pitches, get AI plans) & Investor (review and approve/reject pitches) |
| 🤖 **AI Growth Plan** | Claude AI generates a personalised marketing plan based on your business details |
| 💸 **Rise Fund** | Vendors pitch business ideas with investment needs and expected profit |
| 📋 **Investor Dashboard** | Investors review all pitches and approve or reject them in real time |
| 🌐 **Multilingual** | English, Tamil, and Hindi support on the main dashboard |

---

## 🛠️ Tech Stack

- **Frontend** — HTML, Tailwind CSS, Vanilla JavaScript
- **Backend** — Firebase Authentication + Cloud Firestore
- **AI** — Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Hosting** — Firebase Hosting (recommended)

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/StratiQ.git
cd StratiQ
```

### 2. Run locally
You **must** use a local server — Firebase does not work with `file://` protocol.

**Option A — VS Code Live Server (easiest)**
- Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Right-click `dashboard.html` → **Open with Live Server**

**Option B — Node.js**
```bash
node serve.js
```
Then open `http://localhost:3000`

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project **startiq-ae6af** (or create your own)
3. Enable **Authentication → Email/Password**
4. Go to **Firestore Database → Rules** and paste:

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

5. Click **Publish**

### 4. Add Your Anthropic API Key (Optional)
The AI plan works without a key using Smart Analysis mode. For live Claude AI:

1. Get a free key at [console.anthropic.com](https://console.anthropic.com)
2. Open `buisness-form.html`
3. Find this line:
```javascript
const API_KEY = ""; // ← paste your key here
```
4. Add your key:
```javascript
const API_KEY = "sk-ant-your-key-here";
```

> ⚠️ **Never commit your API key to GitHub.**

---

## 📁 Project Structure

```
StratiQ/
├── dashboard.html          # Main landing page (vendor home)
├── login.html              # Login page
├── register.html           # Registration with role selection
├── buisness-form.html      # Business profile + AI growth plan
├── fund.html               # Vendor pitch submission
├── investordashboard.html  # Investor pitch review
├── contact.html            # Contact page
├── firebase.js             # Firebase config
├── auth.js                 # Login & register logic
├── script.js               # Pitch submission & loading
├── serve.js                # Local development server
└── README.md
```

---

## 🔐 How It Works

```
Register as Vendor          Register as Investor
       ↓                            ↓
  dashboard.html          investordashboard.html
       ↓                            ↓
Get AI Growth Plan          View all pitches
       ↓                            ↓
Submit Pitch (fund.html)    Approve / Reject
       ↓                            ↓
  Saved to Firestore    Status updated in real time
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit — `git commit -m "feat: add your feature"`
4. Push — `git push origin feat/your-feature`
5. Open a Pull Request

### Commit Message Format
| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/styling changes |
| `refactor:` | Code cleanup |
| `docs:` | README or documentation |
| `chore:` | Config, dependencies |

---

## 🐛 Known Issues

- AI plan requires an Anthropic API key for live generation (Smart Analysis fallback works without it)
- Must be served over HTTP — does not work with `file://` protocol
- Firestore rules must be published before pitches can be saved or loaded

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 👩‍💻 Built by

**Neeethu T Biju** — [GitHub](https://github.com/NeethutBiju)

> *StratiQ — Your partner in financial growth and intelligence.*
