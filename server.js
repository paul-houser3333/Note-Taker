const express = require ("express")
const path = require ("path")
const fs = require ("fs")

const app = express();
const port = process.env.PORT || 9000;
const mainDir = path.join(__dirname + "/public");

let notesData = []
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    //res.sendFile(path.join(__dirname, "/db/db.json"));
    
    notesData = fs.readFileSync("./db/db.json", "utf8")
    notesData = JSON.parse(notesData)
    res.json(notesData)
});

app.get("/api/notes/:id", function(req, res) {
    let notesData = JSON.parse(readFileSync("./db/db.json", "utf8"));
    res.json(notesData[Number(req.params.id)]);
});

app.get("/", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
     notesData = fs.readFileSync("./db/db.json", "utf8");
     console.log(notesData)
     notesData = JSON.parse(notesData)
     req.body.id = notesData.length
     notesData.push(req.body)
     notesData = JSON.stringify(notesData)
     

    
    // let newNote = req.body;
    // let uniqueID = (savedNotes.length);
    // newNote.id = uniqueID;
    // savedNotes.push(newNote);

    fs.writeFile("./db/db.json", notesData, "utf8", function(err){
        if (err) throw err

    });
    //console.log("Note saved to db.json. Content: ", notesData);
    res.json(JSON.parse(notesData));
})

app.delete("/api/notes/:id", function(req, res) {
    let notesData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    notesData = notesData.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of notesData) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(notesData));
    res.json(notesData);
})

app.listen(port, function() {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
})


