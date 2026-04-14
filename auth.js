// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey:            "AIzaSyBH2oZd6zenoL9UCX5tmjqwFHxKA_myUhE",
  authDomain:        "poutry-6dd09.firebaseapp.com",
  projectId:         "poutry-6dd09",
  storageBucket:     "poutry-6dd09.firebasestorage.app",
  messagingSenderId: "545675418902",
  appId:             "1:545675418902:web:26f4a527c07271a055c437",
  measurementId:     "G-17K96LSJYC"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Extract name from email — part before @
// e.g. "john.doe@farm.com" → "John Doe"
// e.g. "farmowner@gmail.com" → "Farmowner"
function nameFromEmail(email) {
  if (!email) return 'User';
  return email
    .split('@')[0]                          // take part before @
    .replace(/[._-]+/g, ' ')               // replace dots/underscores/dashes with space
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalise each word
}

// Friendly error messages
function friendlyError(code) {
  const map = {
    'auth/user-not-found':         'No account found with that email.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/invalid-credential':     'Incorrect email or password.',
    'auth/too-many-requests':      'Too many failed attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/user-disabled':          'This account has been disabled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// Login
window.login = function () {
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("errorMsg").innerText = "Please enter your email and password.";
    return;
  }

  const btn = document.getElementById("loginBtn");
  if (btn) { btn.disabled = true; btn.textContent = "Signing in…"; }

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      const user = cred.user;

      // Cache name extracted from email for nav.js profile display
      localStorage.setItem('navUserCache', JSON.stringify({
        name:     nameFromEmail(user.email),  // e.g. "john.doe@farm.com" → "John Doe"
        email:    user.email    || '',
        photoURL: user.photoURL || '',
        uid:      user.uid
      }));

      const msg = document.getElementById("errorMsg");
      if (msg) { msg.style.color = "#00c864"; msg.innerText = "✅ Login successful — redirecting…"; }

      setTimeout(() => { window.location.href = "Smart Poultry Management.html"; }, 800);
    })
    .catch(error => {
      if (btn) { btn.disabled = false; btn.textContent = "Login"; }
      document.getElementById("errorMsg").innerText = friendlyError(error.code);
    });
};
