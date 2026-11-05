
import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    ref,
    push,
    set,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";


const form = document.getElementById("studentForm");
const table = document.getElementById("studentsTable");


// Authentication Check

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
    } else {
        loadStudents();
    }

});


// Add Student

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const regn = document.getElementById("regn").value.trim();
        const name = document.getElementById("name").value.trim();
        const course = document.getElementById("course").value.trim();

        if (!regn || !name || !course) {
            alert("Please fill all fields!");
            return;
        }

        const studentRef = push(ref(db, "students"));

        await set(studentRef, {
            regn: regn,
            name: name,
            course: course,
            createdAt: new Date().toISOString()
        });

        alert("Student added successfully!");

        form.reset();

        await loadStudents();

    } catch (error) {

        console.error(error);
        alert("Student Save Failed: " + error.message);

    }

});


// Load Students

async function loadStudents() {

    try {

        const snapshot = await get(ref(db, "students"));

        table.innerHTML = "";

        if (!snapshot.exists()) {

            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "No Students Found";

            row.appendChild(cell);
            table.appendChild(row);

            return;
        }

        const data = snapshot.val();

        for (const id in data) {

            const student = data[id];

            const row = document.createElement("tr");

            const regnCell = document.createElement("td");
            regnCell.textContent = student.regn || "";

            const nameCell = document.createElement("td");
            nameCell.textContent = student.name || "";

            const courseCell = document.createElement("td");
            courseCell.textContent = student.course || "";

            const actionCell = document.createElement("td");

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", async () => {

                if (confirm("Delete this student?")) {

                    try {

                        await remove(ref(db, `students/${id}`));

                        alert("Student deleted successfully!");

                        await loadStudents();

                    } catch (error) {

                        alert(error.message);

                    }

                }

            });

            actionCell.appendChild(deleteButton);

            row.appendChild(regnCell);
            row.appendChild(nameCell);
            row.appendChild(courseCell);
            row.appendChild(actionCell);

            table.appendChild(row);

        }

    } catch (error) {

        console.error(error);
        alert("Unable to load students: " + error.message);

    }

}
