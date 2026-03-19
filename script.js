// script.js — handles pitch submission and loading
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Only initialize if not already done (prevents duplicate app error)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "startiq-ae6af.firebaseapp.com",
  projectId: "startiq-ae6af",
  storageBucket: "startiq-ae6af.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:YOUR_MESSAGING_SENDER_ID:web:66b7b4c093cf41711a3245"
};

const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

let currentUser = null;

// ── Global logout for any page that loads script.js ──────────
window.logout = async function() {
  await signOut(auth);
  location.href = "login.html";
};

// ── Auth state ────────────────────────────────────────────────
onAuthStateChanged(auth, user => {
  currentUser = user || null;

  const nameEl = document.getElementById("userName");
  if (nameEl && user) nameEl.textContent = user.displayName || user.email;

  if (document.getElementById("vendorPitches"))   loadVendorPitches();
  if (document.getElementById("investorPitches")) loadInvestorPitches();
});

// ── SUBMIT PITCH ──────────────────────────────────────────────
window.submitPitch = async function(e) {
  e.preventDefault();

  const idea        = document.getElementById("idea")?.value.trim();
  const investment  = document.getElementById("investment")?.value.trim();
  const profit      = document.getElementById("profit")?.value.trim();
  const description = document.getElementById("description")?.value.trim();
  const category    = document.getElementById("category")?.value || "general";
  const timeline    = document.getElementById("timeline")?.value || "1 year";
  const errEl       = document.getElementById("pitchError");
  const successEl   = document.getElementById("pitchSuccess");

  const showErr = msg => { if(errEl){ errEl.textContent=msg; errEl.classList.remove("hidden"); setTimeout(()=>errEl.classList.add("hidden"),5000); } else alert(msg); };

  if (!idea)        return showErr("Please enter your business idea.");
  if (!investment)  return showErr("Please enter the investment amount.");
  if (!profit)      return showErr("Please enter the expected profit %.");
  if (!description) return showErr("Please add a description.");
  if (!currentUser) return showErr("You must be logged in to submit a pitch.");

  const btn = e.target.querySelector("button[type='submit']");
  const origHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span style="display:inline-block;animation:spin 0.8s linear infinite" class="material-symbols-outlined text-base">refresh</span> Submitting...`;

  try {
    await addDoc(collection(db, "pitches"), {
      vendorId:    currentUser.uid,
      vendorEmail: currentUser.email,
      idea, investment: Number(investment), profit: Number(profit),
      description, category, timeline,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    if (successEl) { successEl.classList.remove("hidden"); setTimeout(()=>successEl.classList.add("hidden"), 5000); }
    e.target.reset();
    loadVendorPitches();

  } catch (err) {
    console.error(err);
    if (err.code === "permission-denied")
      showErr("Firestore rules not published yet. Go to Firebase Console → Firestore → Rules → Publish.");
    else
      showErr("Failed to submit: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = origHTML;
  }
};

// ── LOAD VENDOR PITCHES ───────────────────────────────────────
async function loadVendorPitches() {
  const container = document.getElementById("vendorPitches");
  if (!container || !currentUser) return;

  container.innerHTML = `<div class="flex items-center justify-center gap-2 py-6 text-gray-500 text-sm"><span class="material-symbols-outlined text-lg" style="animation:spin 1s linear infinite">refresh</span> Loading...</div>`;

  try {
    const snap = await getDocs(collection(db, "pitches"));
    const mine = [];
    snap.forEach(d => { if (d.data().vendorId === currentUser.uid) mine.push({...d.data(), id: d.id}); });
    mine.reverse();

    if (mine.length === 0) {
      container.innerHTML = `<div class="text-center py-8 text-gray-500"><span class="material-symbols-outlined text-3xl block mb-2 opacity-40">inbox</span><p class="text-sm">No pitches yet. Submit your first pitch!</p></div>`;
      return;
    }

    container.innerHTML = "";
    mine.forEach(p => {
      const sc = p.status==="Approved" ? "text-green-400" : p.status==="Rejected" ? "text-red-400" : "text-yellow-400";
      const si = p.status==="Approved" ? "check_circle" : p.status==="Rejected" ? "cancel" : "hourglass_empty";
      const date = p.createdAt?.toDate?.()?.toLocaleDateString?.() || "Just now";
      container.innerHTML += `
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 hover:border-white/20 transition">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h4 class="text-white font-bold text-sm truncate">${p.idea}</h4>
              <p class="text-gray-500 text-xs mt-0.5 line-clamp-2">${(p.description||"").slice(0,90)}${(p.description?.length||0)>90?"…":""}</p>
              <div class="flex flex-wrap gap-3 mt-2">
                <span class="text-xs text-gray-500">₹${Number(p.investment).toLocaleString()}</span>
                <span class="text-xs text-gray-500">${p.profit}% profit</span>
                <span class="text-xs text-gray-500">${date}</span>
              </div>
            </div>
            <div class="flex-shrink-0 text-right">
              <span class="material-symbols-outlined ${sc} text-xl block">${si}</span>
              <p class="${sc} text-xs font-bold mt-0.5">${p.status}</p>
            </div>
          </div>
        </div>`;
    });

  } catch (err) {
    if (err.code === "permission-denied") {
      container.innerHTML = `<div class="text-center py-6"><span class="material-symbols-outlined text-yellow-400 text-3xl block mb-2">warning</span><p class="text-yellow-400 text-sm font-semibold">Firestore Rules Not Published</p><p class="text-gray-500 text-xs mt-1">Firebase Console → Firestore → Rules → Publish</p></div>`;
    } else {
      container.innerHTML = `<p class="text-red-400 text-xs text-center py-4">Error: ${err.message}</p>`;
    }
  }
}

// ── LOAD INVESTOR PITCHES ─────────────────────────────────────
async function loadInvestorPitches() {
  const container = document.getElementById("investorPitches");
  if (!container || !currentUser) return;

  container.innerHTML = `<div class="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm"><span class="material-symbols-outlined text-lg" style="animation:spin 1s linear infinite">refresh</span> Loading pitches...</div>`;

  try {
    const snap = await getDocs(collection(db, "pitches"));
    const all = [];
    snap.forEach(d => all.push({...d.data(), id: d.id}));
    all.reverse();

    if (all.length === 0) {
      container.innerHTML = `<div class="text-center py-10 text-gray-500"><span class="material-symbols-outlined text-4xl block mb-2 opacity-40">inbox</span><p>No pitches submitted yet.</p></div>`;
      return;
    }

    container.innerHTML = "";
    all.forEach(p => {
      const badge = p.status==="Approved" ? "bg-green-500/10 text-green-400 border-green-500/30" :
                    p.status==="Rejected"  ? "bg-red-500/10 text-red-400 border-red-500/30" :
                    "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      const date = p.createdAt?.toDate?.()?.toLocaleDateString?.() || "Recent";
      container.innerHTML += `
        <div class="pitch-card bg-white/5 border border-white/10 rounded-xl p-6 mb-4 hover:border-white/20 transition" data-status="${p.status}">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 class="text-white font-bold text-lg leading-tight">${p.idea}</h3>
              <p class="text-gray-500 text-xs mt-1">${p.vendorEmail||"Vendor"} · ${date} · ${p.category||"General"}</p>
            </div>
            <span class="border text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${badge}">${p.status}</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">${p.description||""}</p>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="bg-white/5 rounded-lg p-3 text-center"><p class="text-gray-400 text-xs mb-1">Investment</p><p class="text-white font-bold">₹${Number(p.investment).toLocaleString()}</p></div>
            <div class="bg-white/5 rounded-lg p-3 text-center"><p class="text-gray-400 text-xs mb-1">Profit</p><p class="text-[#13ec13] font-bold">${p.profit}%</p></div>
            <div class="bg-white/5 rounded-lg p-3 text-center"><p class="text-gray-400 text-xs mb-1">Timeline</p><p class="text-white font-bold text-sm">${p.timeline||"N/A"}</p></div>
          </div>
          ${p.status==="Pending" ? `
          <div class="flex gap-3">
            <button onclick="updateStatus('${p.id}','Approved')" class="flex-1 bg-[#13ec13] hover:bg-[#0fd60f] text-[#0d1b0d] font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-base">check</span> Approve
            </button>
            <button onclick="updateStatus('${p.id}','Rejected')" class="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-1">
              <span class="material-symbols-outlined text-base">close</span> Reject
            </button>
          </div>` : `<p class="text-gray-600 text-xs text-center">Decision recorded.</p>`}
        </div>`;
    });

  } catch (err) {
    if (err.code === "permission-denied") {
      container.innerHTML = `<div class="text-center py-10"><span class="material-symbols-outlined text-yellow-400 text-4xl block mb-2">warning</span><p class="text-yellow-400 font-semibold text-sm">Firestore Rules Not Published</p><p class="text-gray-500 text-xs mt-2">Firebase Console → Firestore Database → Rules → paste rules → Publish</p></div>`;
    } else {
      container.innerHTML = `<p class="text-red-400 text-sm text-center py-4">Error: ${err.message}</p>`;
    }
  }
}

// ── UPDATE STATUS ─────────────────────────────────────────────
window.updateStatus = async function(pitchId, newStatus) {
  if (!confirm(`Mark this pitch as "${newStatus}"?`)) return;
  try {
    await updateDoc(doc(db, "pitches", pitchId), {
      status: newStatus,
      reviewedBy: currentUser?.uid,
      reviewedAt: serverTimestamp()
    });
    loadInvestorPitches();
  } catch (err) {
    alert(err.code === "permission-denied" ? "Publish Firestore rules first." : "Error: " + err.message);
  }
};

// ── Spin animation ────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
document.head.appendChild(style);
