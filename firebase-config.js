import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDevkAvSpVaKqh0IoLispqQDEJPVHR5hH0",
  authDomain: "online-attendance-system-a0f1e.firebaseapp.com",
  databaseURL: "https://online-attendance-system-a0f1e-default-rtdb.firebaseio.com",
  projectId: "online-attendance-system-a0f1e",
  storageBucket: "online-attendance-system-a0f1e.firebasestorage.app",
  messagingSenderId: "1013226479347",
  appId: "1:1013226479347:web:48afcc28fde26658462186",
  measurementId: "G-WYNB1NN5XW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
