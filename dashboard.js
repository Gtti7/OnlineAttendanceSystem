import { auth, db } from "./firebase-config.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


import {
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";


const table =
    document.getElementById("studentTable");


const dateInput =
    document.getElementById("attendanceDate");


const saveButton =
    document.getElementById("saveAttendance");


const message =
    document.getElementById("message");


const logoutBtn =
    document.getElementById("logoutBtn");


// Today's date

const today =
    new Date().toISOString().split("T")[0];


dateInput.value = today;


let students = {};


// Check Login

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

    }
    else {

        loadStudents();

    }

});


// Load students

async function loadStudents() {

    const studentsRef =
        ref(db, "students");

    const snapshot =
        await get(studentsRef);


    table.innerHTML = "";


    if (!snapshot.exists()) {

        table.innerHTML = `
        
        <tr>
            <td colspan="5">
                No students found.
                Add students first.
            </td>
        </tr>
        
        `;

        return;

    }


    students =
        snapshot.val();


    for (const id in students) {

        const student =
            students[id];


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student.roll}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${student.course}
            </td>

            <td>

                <input
                    type="radio"
                    name="attendance_${id}"
                    value="Present"
                    checked
                    data-id="${id}"
                >

            </td>

            <td>

                <input
                    type="radio"
                    name="attendance_${id}"
                    value="Absent"
                    data-id="${id}"
                >

            </td>

        `;


        table.appendChild(row);

    }

}


// Save attendance

saveButton.addEventListener("click", async () => {


    const selectedDate =
        dateInput.value;


    if (!selectedDate) {

        alert("Please select a date.");

        return;

    }


    try {

        for (const id in students) {


            const selected =
                document.querySelector(
                    `input[name="attendance_${id}"]:checked`
                );


            if (!selected) continue;


            const status =
                selected.value;


            const student =
                students[id];


            await set(

                ref(
                    db,
                    `attendance/${selectedDate}/${id}`
                ),

                {

                    name: student.name,

                    roll: student.roll,

                    course: student.course,

                    status: status,

                    date: selectedDate

                }

            );

        }


        message.innerText =
            "Attendance saved successfully!";


    }

    catch (error) {

        console.error(error);

        message.innerText =
            "Error saving attendance.";

    }

});


// Logout

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href =
        "index.html";

});