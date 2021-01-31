const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get("noteId");

console.log(noteId);

var sharedb = require("sharedb/lib/client");
var StringBinding = require("sharedb-string-binding");

// Open WebSocket connection to ShareDB server
var ReconnectingWebSocket = require("reconnecting-websocket");
var socket = new ReconnectingWebSocket("ws://localhost:3000");
var connection = new sharedb.Connection(socket);

const notesCont = document.querySelector("#note");

let doc = connection.get("notes", noteId);
doc.subscribe(function (err) {
  if (err) throw err;
  let binding = new StringBinding(notesCont, doc, ["content"]);
  binding.setup();
});
