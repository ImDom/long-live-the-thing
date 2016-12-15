var socket = io();

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
      socket.emit('jumpAction');
      console.log('Jump');
    }
};