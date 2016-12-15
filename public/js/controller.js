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

    ready: function () {
        socket.emit('ready', {name: document.getElementById("name").value});
        document.getElementById('controller').style.display = "flex";
        document.getElementById('menu').style.display = "none";
        window.localStorage.setItem("name", document.getElementById("name").value);
    }
};

socket.on("start game", function (data) {
});

document.getElementById("name").value = window.localStorage.getItem("name");

document.getElementById('jump').addEventListener("touchstart", actions.jump, false);
document.getElementById('ready').addEventListener("touchend", actions.ready, false);
document.getElementById('freeze').addEventListener("touchstart", actions.freeze, false);

document.getElementById('jump').addEventListener("mousedown", actions.jump, false);
document.getElementById('ready').addEventListener("mousedown", actions.ready, false);
document.getElementById('freeze').addEventListener("mousedown", actions.freeze, false);
