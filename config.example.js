// ============================================================
// SETUP INSTRUCTIONS
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Select your project → Project Settings → General
// 3. Scroll down to "Your apps" → copy your Firebase config
// 4. Replace the placeholders in every file that has:
//    YOUR_FIREBASE_API_KEY, YOUR_MESSAGING_SENDER_ID, YOUR_APP_ID
//
// Files to update:
//   - firebase.js
//   - login.html
//   - register.html
//   - dashboard.html
//   - fund.html
//   - investordashboard.html
//   - buisness-form.html
//   - script.js
//
// Your config will look like this:
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSy...",                        // YOUR_FIREBASE_API_KEY
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",             // YOUR_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abcdef"             // YOUR_APP_ID
};

// ============================================================
// For Anthropic API Key (AI Growth Plan):
// 1. Get a free key at https://console.anthropic.com
// 2. Open buisness-form.html
// 3. Find: const API_KEY = "";
// 4. Replace with: const API_KEY = "sk-ant-your-key-here";
// ⚠️  Never commit your API keys to GitHub
// ============================================================
