var actions = {
  jump: function() {
      socket.emit('jumpAction');
      console.log('Jump');
  }
};