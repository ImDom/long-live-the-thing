var socket = io.connect('/controller');

var actions = {
    moveForward: function () {
        socket.emit('moveForward');
        console.log('Move Forward');
    },

    moveBackward: function () {
        socket.emit('moveBackward');
        console.log('Move Backward');
    },

    jump: function () {
      socket.emit('controller action', {action: 'jump'});
      console.log('Jump');
    },

    freeze: function () {
      socket.emit('controller action', {action: 'freeze'});
      console.log('Freeze');
    },

    startGame: function () {
        socket.emit('controller action', {action: 'startGame'});
        console.log("Start game");
    }
};

socket.on("start game", function (data) {
    document.getElementById('controller').style.display = "flex";
    document.getElementById('menu').style.display = "none";
});

document.getElementById('jump').addEventListener("touchstart", actions.jump, false);
document.getElementById('startGame').addEventListener("touchstart", actions.startGame, false);
document.getElementById('freeze').addEventListener("touchstart", actions.freeze, false);


document.getElementById('jump').addEventListener("mousedown", actions.jump, false);
document.getElementById('startGame').addEventListener("mousedown", actions.startGame, false);
document.getElementById('freeze').addEventListener("mousedown", actions.freeze, false);
