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


const form =
    document.getElementById("studentForm");


const table =
    document.getElementById("studentsTable");


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "index.html";

    }
    else {

        loadStudents();

    }

});


// Add Student

form.addEventListener("submit", async (e) => {

    e.preventDefault();


    const roll =
        document.getElementById("roll").value.trim();


    const name =
        document.getElementById("name").value.trim();


    const course =
        document.getElementById("course").value.trim();


    const studentRef =
        push(ref(db, "students"));


    await set(

        studentRef,

        {

            roll: roll,

            name: name,

            course: course

        }

    );


    alert("Student added successfully!");


    form.reset();


    loadStudents();

});


// Load Students

async function loadStudents() {


    const snapshot =
        await get(
            ref(db, "students")
        );


    table.innerHTML = "";


    if (!snapshot.exists()) {

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

                <button
                    class="delete-btn"
                    data-id="${id}">

                    Delete

                </button>

            </td>

        `;


        table.appendChild(row);

    }


    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {


            button.addEventListener(
                "click",
                async () => {


                    const id =
                        button.dataset.id;


                    if (
                        confirm(
                            "Delete this student?"
                        )
                    ) {


                        await remove(

                            ref(
                                db,
                                `students/${id}`
                            )

                        );


                        loadStudents();

                    }

                }
            );

        });

}