const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new MongoClient("mongodb://127.0.0.1:27017");

let db;

async function startServer() {

    await client.connect();

    db = client.db("student_notes");

    console.log("MongoDB Connected");

}

startServer();


// ADD NOTE
app.post("/notes", async (req, res) => {

    const note = {
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        created_date: new Date()
    };

    const result = await db.collection("notes").insertOne(note);

    res.send(result);

});


// VIEW NOTES
app.get("/notes", async (req, res) => {

    const notes = await db.collection("notes").find().toArray();

    res.send(notes);

});


// UPDATE NOTE
app.put("/notes/:id", async (req, res) => {

    const id = req.params.id;

    await db.collection("notes").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }
    );

    res.send("Updated");

});


// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {

    const id = req.params.id;

    await db.collection("notes").deleteOne({
        _id: new ObjectId(id)
    });

    res.send("Deleted");

});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});