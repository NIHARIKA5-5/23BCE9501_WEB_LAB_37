// ADD NOTE
function addNote() {

    const title = document.getElementById("title").value;
    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;

    fetch("/notes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            subject: subject,
            description: description
        })

    })
    .then(res => res.json())
    .then(() => {

        alert("Note Added");

        getNotes();

    });

}



// VIEW NOTES
function getNotes() {

    fetch("/notes")

    .then(res => res.json())

    .then(data => {

        let output = "";

        data.forEach(note => {

            output += `
            <div style="border:1px solid black; padding:10px; margin:10px;">
                <h3>${note.title}</h3>
                <p>Subject: ${note.subject}</p>
                <p>${note.description}</p>

                <button onclick="updateNote('${note._id}')">Edit</button>
                <button onclick="deleteNote('${note._id}')">Delete</button>

            </div>
            `;

        });

        document.getElementById("notes").innerHTML = output;

    });

}



// DELETE NOTE
function deleteNote(id) {

    fetch("/notes/" + id, {

        method: "DELETE"

    })

    .then(() => {

        alert("Note Deleted");

        getNotes();

    });

}



// UPDATE NOTE
function updateNote(id) {

    const newTitle = prompt("Enter new title");

    const newDescription = prompt("Enter new description");

    fetch("/notes/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            title: newTitle,
            description: newDescription

        })

    })

    .then(() => {

        alert("Note Updated");

        getNotes();

    });

}



window.onload = getNotes;