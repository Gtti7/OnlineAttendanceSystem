
import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
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

// Check Login
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

        const roll = document.getElementById("roll").value.trim();
        const name = document.getElementById("name").value.trim();
        const course = document.getElementById("course").value.trim();

        if (!roll || !name || !course) {
            alert("Please fill all fields!");
            return;
        }

        const studentRef = push(ref(db, "students"));

        await set(studentRef, {
            roll: roll,
            name: name,
            course: course,
            createdAt: new Date().toISOString()
        });

        alert("Student added successfully!");

        form.reset();

        await loadStudents();

    } catch (error) {

        console.error("Firebase Error:", error);

        alert("Student Save Failed: " + error.message);

    }

});

// Load Students
async function loadStudents() {

    try {

        const snapshot = await get(ref(db, "students"));

        table.innerHTML = "";

        if (!snapshot.exists()) {
            table.innerHTML =
                "<tr><td colspan='4'>No Students Found</td></tr>";
            return;
        }

        const data = snapshot.val();

        for (const id in data) {

            const student = data[id];

            const row = document.createElement("tr");

            const rollCell = document.createElement("td");
            rollCell.textContent = student.roll || "";

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
                        alert("Student deleted!");
                        await loadStudents();

                    } catch (error) {
                        alert(error.message);
                    }

                }

            });

            actionCell.appendChild(deleteButton);

            row.appendChild(rollCell);
            row.appendChild(nameCell);
            row.appendChild(courseCell);
            row.appendChild(actionCell);

            table.appendChild(row);

        }

    } catch (error) {

        console.error("Load Error:", error);

        alert("Unable to load students: " + error.message);

    }

}
