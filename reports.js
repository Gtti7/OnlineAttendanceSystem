import { auth, db } from "./firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";


const table =
    document.getElementById("reportTable");


const dateInput =
    document.getElementById("reportDate");


const monthInput =
    document.getElementById("reportMonth");


const title =
    document.getElementById("reportTitle");


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "index.html";

    }

});


// Date-wise report

document
    .getElementById("dateReport")
    .addEventListener("click", async () => {


        const date =
            dateInput.value;


        if (!date) {

            alert("Select a date.");

            return;

        }


        const snapshot =
            await get(
                ref(
                    db,
                    `attendance/${date}`
                )
            );


        table.innerHTML = "";


        title.innerText =
            `Attendance Report - ${date}`;


        if (!snapshot.exists()) {

            table.innerHTML = `

                <tr>

                    <td colspan="5">
                        No attendance found.
                    </td>

                </tr>

            `;

            return;

        }


        const data =
            snapshot.val();


        for (const id in data) {

            const student =
                data[id];


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td>${student.course}</td>

                <td>
                    ${student.status}
                </td>

                <td>${student.date}</td>

            `;


            table.appendChild(row);

        }

    });


// Monthly report

document
    .getElementById("monthlyReport")
    .addEventListener("click", async () => {


        const month =
            monthInput.value;


        if (!month) {

            alert("Select a month.");

            return;

        }


        const snapshot =
            await get(
                ref(db, "attendance")
            );


        table.innerHTML = "";


        title.innerText =
            `Monthly Attendance - ${month}`;


        if (!snapshot.exists()) {

            return;

        }


        const attendance =
            snapshot.val();


        const summary = {};


        for (const date in attendance) {


            if (!date.startsWith(month)) {

                continue;

            }


            const dayData =
                attendance[date];


            for (const studentId in dayData) {


                const student =
                    dayData[studentId];


                if (!summary[studentId]) {

                    summary[studentId] = {

                        roll: student.roll,

                        name: student.name,

                        course: student.course,

                        present: 0,

                        absent: 0

                    };

                }


                if (
                    student.status ===
                    "Present"
                ) {

                    summary[
                        studentId
                    ].present++;

                }
                else {

                    summary[
                        studentId
                    ].absent++;

                }

            }

        }


        for (const id in summary) {


            const student =
                summary[id];


            const total =
                student.present +
                student.absent;


            const percentage =
                total > 0
                ? ((student.present / total) * 100)
                    .toFixed(2)
                : "0.00";


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
                    Present:
                    ${student.present}
                    <br>
                    Absent:
                    ${student.absent}
                </td>

                <td>
                    ${percentage}%
                </td>

            `;


            table.appendChild(row);

        }

    });