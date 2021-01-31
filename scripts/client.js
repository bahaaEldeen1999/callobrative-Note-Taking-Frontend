if (!localStorage.getItem("token")) {
  window.location = "index.html";
}

var sharedb = require("sharedb/lib/client");
var StringBinding = require("sharedb-string-binding");

// Open WebSocket connection to ShareDB server
var ReconnectingWebSocket = require("reconnecting-websocket");
var socket = new ReconnectingWebSocket("ws://localhost:3000");
var connection = new sharedb.Connection(socket);

const logoutBTN = document.querySelector("#logoutBTN");
const addNoteBTN = document.querySelector("#addNoteBTN");
const notesCont = document.querySelector("#notes");
const backend = "http://localhost:3000/api/";
logoutBTN.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  window.location = "index.html";
});

async function getNotes() {
  let noteIds = await fetch(backend + "note/notes", {
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });

  noteIds = await noteIds.json();
  let indx = 0;
  for (let noteId of noteIds.notes) {
    noteId = noteId.id;
    let div = document.createElement("div");
    let text = document.createElement("textarea");
    let btn = document.createElement("button");
    let btnShare = document.createElement("button");
    text.style.display = "block";
    btn.innerText = "Edit";
    btnShare.innerText = "Share";
    btnShare.id = String(indx);
    btn.addEventListener("click", (e) => {
      let doc = connection.get("notes", noteId);
      //console.log(noteId);
      doc.subscribe(function (err) {
        if (err) throw err;
        let text = document.getElementById("addNoteTextArea");
        let binding = new StringBinding(text, doc, ["content"]);
        binding.setup();
      });
      $("#addNoteModal").modal();
    });
    btnShare.addEventListener("click", async () => {
      let link = await fetch(backend + "note/note/callobration", {
        method: "POST",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteIndx: Number(btnShare.id),
        }),
      });
      link = await link.text();
      document.getElementById("sharedLink").innerText = link;
      $("#sharedLinkModal").modal();
    });
    //text.innerText = noteId;
    text.readOnly = true;
    div.style.border = "1px solid black";
    div.style.margin = "10px";
    div.style.padding = "10px";
    div.appendChild(text);
    div.appendChild(btn);
    div.appendChild(btnShare);
    notesCont.appendChild(div);
    //console.log("dds");
    let doc = connection.get("notes", noteId);
    doc.subscribe(function (err) {
      if (err) throw err;
      let binding = new StringBinding(text, doc, ["content"]);
      binding.setup();
    });
    indx++;
  }
}
getNotes();
addNoteBTN.addEventListener("click", async () => {
  let noteId = await fetch(backend + "note/note", {
    method: "POST",
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });
  noteId = await noteId.text();
  let text = document.getElementById("addNoteTextArea");
  let doc = connection.get("notes", noteId);
  doc.subscribe(function (err) {
    if (err) throw err;
    let binding = new StringBinding(text, doc, ["content"]);
    binding.setup();
  });
  $("#addNoteModal").modal();
});

$("#addNoteModal").on("hide.bs.modal", function (e) {
  //console.log("gg")
  window.location.reload();
});
