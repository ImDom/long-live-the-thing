var socket = io.connect('/controller');

socket.emit('new player', { x: 10, y: 10, angle:10 })

var actions = {
    moveForward: function() {
        socket.emit('moveForward');
        console.log('Move Forward');
    },

    moveBackward: function() {
        socket.emit('moveBackward');
        console.log('Move Backward');
    },

    jump: function() {
      socket.emit('controller action', {action: 'jump'});
      console.log('Jump');
    }
};

document.getElementById('jump').addEventListener("touchstart", actions.jump, false);
