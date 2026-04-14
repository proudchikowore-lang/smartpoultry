// Import Firebase properly as ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config (same as in auth.js)
const firebaseConfig = {
  apiKey: "AIzaSyBH2oZd6zenoL9UCX5tmjqwFHxKA_myUhE",
  authDomain: "poutry-6dd09.firebaseapp.com",
  projectId: "poutry-6dd09",
  storageBucket: "poutry-6dd09.firebasestorage.app",
  messagingSenderId: "545675418902",
  appId: "1:545675418902:web:26f4a527c07271a055c437",
  measurementId: "G-17K96LSJYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for authentication state
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("index.html");
  }
});

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.replace("login.html");
    });
  });
}