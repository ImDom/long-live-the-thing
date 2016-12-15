var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var io = require('socket.io');
var playerColors = require('./playerColors');

var port = process.env.PORT || 8080;

/* ************************************************
** GAME VARIABLES
************************************************ */
var socket;
var socketGame;
var socketController;

/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(
    ecstatic({ cache: 0, root: path.resolve(__dirname, './public') })
).listen(port, function (err) {
    if (err) {
      throw err;
    }

    init();
});

function init () {
    // Attach Socket.IO to server
    socket = io.listen(server);

    // Create Socket.IO namespaces
    socketGame = socket.of("/game");
    socketController = socket.of("/controller");

    // Start listening for events
    setEventHandlers();
}

/* ************************************************
** GAME EVENT HANDLERS
************************************************ */
var setEventHandlers = function () {
    // Socket.IO
    socketGame.on("connection", onSocketGameConnection);
    socketController.on("connection", onSocketControllerConnection);
}

// New socket connection
function onSocketGameConnection (client) {
    util.log('Game client has connected: ' + client.id)
}

function onSocketControllerConnection (client) {
    util.log('New player has connected: ' + client.id);

    socketGame.emit('new player');

    // Listen for client disconnected
    client.on('disconnect', onControllerDisconnect);

    // Listen for move player message
    client.on('controller action', onControllerAction);
}

// Socket client has disconnected
function onControllerDisconnect () {
    util.log('Player has disconnected: ' + this.id);

    socketGame.emit('remove player');
}

// Controller has triggered an action
function onControllerAction (data) {
    // Broadcast updated position to connected socket clients
    socketGame.emit('controller action', {id: this.id, action: data.action});
}
