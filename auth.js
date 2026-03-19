// auth.js — loaded as type="module" on login.html and register.html
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  setDoc,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ─── Helpers ─────────────────────────────────────────── */
function val(id) {
  return (document.getElementById(id)?.value || "").trim();
}

function showError(msg) {
  const el = document.getElementById("authError");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideError() {
  const el = document.getElementById("authError");
  if (el) el.classList.add("hidden");
}

function setBtnLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block;animation:spin 0.8s linear infinite;vertical-align:middle" class="material-symbols-outlined text-base">refresh</span>&nbsp; Please wait...`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalHtml || btn.dataset.label || "Submit";
  }
}



/* ─── LOGIN ───────────────────────────────────────────── */
window.login = async function(btn) {
  hideError();
  const email    = val("email");
  const password = val("password");

  if (!email)    return showError("Please enter your email.");
  if (!password) return showError("Please enter your password.");

  setBtnLoading(btn, true);

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Try to read role from Firestore
    let role = "vendor"; // default fallback
    try {
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists() && snap.data().role) {
        role = snap.data().role;
      }
    } catch (firestoreErr) {
      // Firestore rules not set — use default role, still let them in
      console.warn("Could not read role from Firestore:", firestoreErr.message);
    }

    // Redirect based on role
    if (role === "investor") {
      location.href = "investordashboard.html";
    } else {
      location.href = "dashboard.html";
    }

  } catch (err) {
    setBtnLoading(btn, false);
    if (err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-email") {
      showError("Invalid email or password. Please try again.");
    } else if (err.code === "auth/user-not-found") {
      showError("No account found with this email. Please register.");
    } else if (err.code === "auth/too-many-requests") {
      showError("Too many failed attempts. Please try again later.");
    } else {
      showError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    }
  }
};

/* ─── REGISTER ────────────────────────────────────────── */
window.register = async function(btn) {
  hideError();

  const name            = val("name");
  const email           = val("email");
  const password        = val("password");
  const confirmPassword = val("confirmPassword");
  const role            = val("role");

  // Validate
  if (!name)                          return showError("Please enter your full name.");
  if (!email)                         return showError("Please enter your email address.");
  if (!password)                      return showError("Please enter a password.");
  if (password.length < 6)            return showError("Password must be at least 6 characters.");
  if (password !== confirmPassword)   return showError("Passwords do not match.");
  if (!role)                          return showError("Please select a role (Vendor or Investor).");

  setBtnLoading(btn, true);

  try {
    // Step 1: Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid  = cred.user.uid;

    // Step 2: Save profile to Firestore
    // This REQUIRES Firestore rules to be published.
    // If rules are not set, this will throw but we still redirect.
    try {
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });
      console.log("✅ Profile saved to Firestore for uid:", uid);
    } catch (firestoreErr) {
      console.error("❌ Firestore save failed. Publish your Firestore rules!", firestoreErr.message);
      // Don't block the user — auth account exists, redirect anyway
    }

    // Step 3: Redirect based on chosen role
    if (role === "investor") {
      location.href = "investordashboard.html";
    } else {
      location.href = "dashboard.html";
    }

  } catch (err) {
    setBtnLoading(btn, false);
    if (err.code === "auth/email-already-in-use") {
      showError("An account already exists with this email. Try logging in instead.");
    } else if (err.code === "auth/invalid-email") {
      showError("Please enter a valid email address.");
    } else if (err.code === "auth/weak-password") {
      showError("Password is too weak. Use at least 6 characters.");
    } else {
      showError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    }
  }
};

/* ─── LOGOUT ──────────────────────────────────────────── */
window.logout = async function() {
  await signOut(auth);
  location.href = "login.html";
};

/* ─── Spin animation ──────────────────────────────────── */
const style = document.createElement("style");
style.textContent = `@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`;
document.head.appendChild(style);

/* ─── Attach button listeners by ID (avoids module scope issues) ── */
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn    = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  if (loginBtn) {
    loginBtn.dataset.originalHtml = loginBtn.innerHTML;
    loginBtn.addEventListener("click", () => window.login(loginBtn));
  }

  if (registerBtn) {
    registerBtn.dataset.originalHtml = registerBtn.innerHTML;
    registerBtn.addEventListener("click", () => window.register(registerBtn));
  }

  // Also save original HTML for any data-label buttons
  document.querySelectorAll("button[data-label]").forEach(btn => {
    if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
  });
});