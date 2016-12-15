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
    }
};

document.getElementById('jump').addEventListener("touchstart", actions.jump, false);
document.getElementById('freeze').addEventListener("touchstart", actions.freeze, false);