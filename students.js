
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


// HTML Elements

const form = document.getElementById("studentForm");
const table = document.getElementById("studentsTable");
const addBtn = document.getElementById("addBtn");


// Check Authentication

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

        addBtn.disabled = true;
        addBtn.textContent = "Saving...";


        // Firebase Database Reference

        const studentRef = push(ref(db, "students"));


        // Save Student

        await set(studentRef, {

            regn: regn,
            name: name,
            course: course,
            createdAt: new Date().toISOString()

        });


        alert("Student Added Successfully!");

        form.reset();

        await loadStudents();


    } catch (error) {

        console.error("Save Error:", error);

        alert("Student Save Failed: " + error.message);

    } finally {

        addBtn.disabled = false;
        addBtn.textContent = "Add Student";

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


            // Registration Number

            const regnCell = document.createElement("td");

            regnCell.textContent = student.regn || "";


            // Student Name

            const nameCell = document.createElement("td");

            nameCell.textContent = student.name || "";


            // Course

            const courseCell = document.createElement("td");

            courseCell.textContent = student.course || "";


            // Delete Button

            const actionCell = document.createElement("td");

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.className = "delete-btn";


            deleteButton.addEventListener("click", async () => {

                if (confirm("Are you sure you want to delete this student?")) {

                    try {

                        await remove(ref(db, "students/" + id));

                        alert("Student Deleted Successfully!");

                        await loadStudents();

                    } catch (error) {

                        alert("Delete Failed: " + error.message);

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

        console.error("Load Error:", error);

        alert("Unable to Load Students: " + error.message);

    }

}
