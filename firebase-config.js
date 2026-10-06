import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";


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


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase Authentication
export const auth = getAuth(app);


// Firebase Realtime Database
export const db = getDatabase(app);