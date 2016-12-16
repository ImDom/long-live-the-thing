var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var io = require('socket.io');

var port = process.env.PORT || 8080;

var currentPlayerIds = [];

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
    util.log('Game client has connected: ' + client.id);

    client.on("start game", onGameStart);
    client.on("end game", onGameEnd);

    client.on("disconnect", onGameEnd);
}

function onSocketControllerConnection (client) {
    currentPlayerIds.push(client.id);
    util.log('New player has connected: ' + client.id);

    // Listen for client disconnected
    client.on('disconnect', onControllerDisconnect);

    // Listen for move player message
    client.on('controller action', onControllerAction);

    client.on('ready', onControllerReady)

    client.on('color', function (data) {
        console.log("color", data)

        client.to(data.socketId).emit("color", data.color)
    })
}

function findRandomPlayerId() {
    return currentPlayerIds[Math.floor(Math.random() * currentPlayerIds.length)];
}

function giveFreeze() {
    var playerId = findRandomPlayerId();
    console.log("Giving freeze to playerId", playerId);
    //TODO: push the powerup to the playerId and push the message to game 
}

function onGameStart () {
    console.log("Game Start")
    socketController.emit("start game");
    setTimeout(giveFreeze, 20 * 1000);
}

function onGameEnd () {
    currentPlayerIds = [];
    console.log("Game End");
    socketController.emit("end game");
}

function onControllerReady (data) {
    this.controllerName = data.name;

    socketGame.emit('new player', { id: this.id, name: data.name });
}

// Socket client has disconnected
function onControllerDisconnect () {
    util.log('Player has disconnected: ' + this.id);

    socketGame.emit('remove player', { id: this.id, name: this.controllerName });
}

// Controller has triggered an action
function onControllerAction (data) {
    console.log("Controller action", data);
    // Broadcast updated position to connected socket clients
    socketGame.emit('controller action', {id: this.controllerName, action: data.action});
}
