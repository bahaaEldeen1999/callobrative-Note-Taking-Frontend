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
      "Content-Type": "application/json",
    },
  });

  noteIds = await noteIds.json();
  let indx = 0;
  for (let note of noteIds.notes) {
    let bodyId = note.bodyId;
    let titleId = note.titleId;
    let div = document.createElement("div");
    let textTitle = document.createElement("input");
    let textBody = document.createElement("textarea");
    let btn = document.createElement("button");
    let btnShare = document.createElement("button");

    textTitle.style.display = "block";
    textBody.style.display = "block";

    btn.innerText = "Edit";
    btn.classList.add("btn");
    btnShare.classList.add("btn");
    btn.classList.add("btn-outline-dark");
    btnShare.classList.add("btn-outline-dark");
    btnShare.innerText = "Share";
    btnShare.id = String(indx);

    textBody.classList.add("form-control");
    textTitle.classList.add("form-control");

    btn.addEventListener("click", (e) => {
      let docBody = connection.get("notes", bodyId);
      //console.log(noteId);
      docBody.subscribe(function (err) {
        if (err) throw err;
        let text = document.getElementById("addNoteTextArea");
        let binding = new StringBinding(text, docBody, ["content"]);
        binding.setup();
      });
      let docTitle = connection.get("notes", titleId);
      //console.log(noteId);
      docTitle.subscribe(function (err) {
        if (err) throw err;
        let text = document.getElementById("addNoteTitle");
        let binding = new StringBinding(text, docTitle, ["content"]);
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
    textBody.readOnly = true;
    textTitle.readOnly = true;
    div.style.border = "1px solid black";
    div.style.margin = "10px";
    div.style.padding = "10px";
    div.appendChild(textTitle);
    div.appendChild(textBody);
    div.appendChild(btn);
    div.appendChild(btnShare);
    notesCont.appendChild(div);
    //console.log("dds");
    let docBody = connection.get("notes", bodyId);
    //console.log(noteId);
    docBody.subscribe(function (err) {
      if (err) throw err;
      let binding = new StringBinding(textBody, docBody, ["content"]);
      binding.setup();
    });
    let docTitle = connection.get("notes", titleId);
    //console.log(noteId);
    docTitle.subscribe(function (err) {
      if (err) throw err;
      let binding = new StringBinding(textTitle, docTitle, ["content"]);
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
      "Content-Type": "application/json",
    },
  });
  let note = await noteId.json();
  let docBody = connection.get("notes", note.bodyId);
  //console.log(noteId);
  docBody.subscribe(function (err) {
    if (err) throw err;
    let text = document.getElementById("addNoteTextArea");
    let binding = new StringBinding(text, docBody, ["content"]);
    binding.setup();
  });
  let docTitle = connection.get("notes", note.titleId);
  //console.log(noteId);
  docTitle.subscribe(function (err) {
    if (err) throw err;
    let text = document.getElementById("addNoteTitle");
    let binding = new StringBinding(text, docTitle, ["content"]);
    binding.setup();
  });
  $("#addNoteModal").modal();
});

$("#addNoteModal").on("hide.bs.modal", function (e) {
  //console.log("gg")
  window.location.reload();
});
