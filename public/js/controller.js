var socket = io.connect('/controller');

var canFreeze = false;
var jumped = false;
var actions = {
    moveForward: function () {
        socket.emit('moveForward');
    },

    moveBackward: function () {
        socket.emit('moveBackward');
    },

    jump: function () {
        if (jumped) {
            return;
        }
        socket.emit('controller action', {action: 'jump'});
        jumped = true;
        setTimeout(function () {
            jumped = false;
        }, 100)
    },

    freeze: function () {
        if (canFreeze) {
            socket.emit('controller action', {action: 'freeze'});
            document.getElementById('freeze').style.display = 'none';
            canFreeze = false;
        }
    },

    ready: function () {
        socket.emit('ready', {name: document.getElementById("name").value});
        document.getElementById('controller').style.display = "flex";
        document.getElementById('menu').style.display = "none";
        window.localStorage.setItem("name", document.getElementById("name").value);
    }
};

socket.on('powerUp', function(data) {
    canFreeze = true;
    document.getElementById('freeze').style.display = 'block';
});

socket.on('color', function(data) {
    var color = data.toString(16);

    document.getElementById('jump').style.backgroundColor = "#" + color;
});

socket.on("end game", function (data) {
    location.reload();
});

document.getElementById("name").value = window.localStorage.getItem("name");

document.getElementById('jump').addEventListener("touchstart", actions.jump, false);
document.getElementById('ready').addEventListener("touchend", actions.ready, false);
document.getElementById('freeze').addEventListener("touchend", actions.freeze, false);

document.getElementById('jump').addEventListener("mousedown", actions.jump, false);
document.getElementById('ready').addEventListener("mousedown", actions.ready, false);
document.getElementById('freeze').addEventListener("mousedown", actions.freeze, false);
