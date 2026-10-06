import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");


loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.innerText = "Logging in...";

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("LOGIN SUCCESS:", userCredential.user);

        message.innerText = "Login successful!";

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        message.innerText =
            error.code + " - " + error.message;
    }

});