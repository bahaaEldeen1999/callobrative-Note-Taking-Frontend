const urlParams = new URLSearchParams(window.location.search);
const bodyId = urlParams.get("bodyId");
const titleId = urlParams.get("titleId");

var sharedb = require("sharedb/lib/client");
var StringBinding = require("sharedb-string-binding");

// Open WebSocket connection to ShareDB server
var ReconnectingWebSocket = require("reconnecting-websocket");
var socket = new ReconnectingWebSocket("wss://note-callobration.herokuapp.com");
var connection = new sharedb.Connection(socket);

let docTitle = connection.get("notes", titleId);
docTitle.subscribe(function (err) {
  if (err) throw err;
  let binding = new StringBinding(
    document.getElementById("titleNote"),
    docTitle,
    ["content"]
  );
  binding.setup();
});

let docBody = connection.get("notes", bodyId);
docBody.subscribe(function (err) {
  if (err) throw err;
  let binding = new StringBinding(
    document.getElementById("bodyNote"),
    docBody,
    ["content"]
  );
  binding.setup();
});
