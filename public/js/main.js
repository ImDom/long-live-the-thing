var game, socket;

var gameOptions = {
    width: 1024,
    height: 576,
    floorHeight: 10,
    gravity: 450,
    runnerSpeed: 100
};

var playState = {
    preload: function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.load.image("runner", "assets/runner.png");
        game.load.image("ground", "assets/ground.png");
        game.load.image("background", "assets/sky.png");
        game.load.image("obstacle", "assets/obstacle.png");
        game.load.audio("song", "assets/song.mp3");
    },

    create: function () {
        // Connect socket
        socket = io.connect('/game');

        this.level = new Level();
        this.level.create();
        this.ui = new UI();
        this.ui.create();
        this.obstacles = new Obstacles();
        this.obstacles.create();
        this.players = [];

        // Add the physics engine to all game objects
        game.world.enableBody = true;

        this.bindController();

        game.sound.play('song');
    },

    bindController: function () {
        // Bind controller
        var _this = this;
        socket.on("new player", function (data) {
            _this.newPlayer(data.id);
        });

        socket.on("remove player", function (data) {
            _this.removePlayer(data.id);
        });

        socket.on("controller action", function (data) {
            switch (data.action) {
                case "jump":
                    _this.findPlayer(data.id).jump();
                    break;
            }
        });
    },

    update: function () {
        this.level.update();
        this.ui.update();
        this.checkState();

        for (var id in this.players) {
            var player = this.players[id];
            player.update(this.obstacles.group, this.level.floor);
        }
    },

    findPlayer: function(id) {
        return this.players[id];
    },

    newPlayer: function (id) {
        this.players[id] = new Player(id);
    },

    removePlayer: function (id) {
        delete this.players[id];
    },

    checkState: function () {
        // TODO - All player are dead, endgame
    },

    endGame: function () {
        // TODO
    }
};

window.onload = function() {
    game = new Phaser.Game(gameOptions.width, gameOptions.height);

    // adding game states
    //game.state.add("menu", menuState);
    game.state.add("play", playState);

    // starting the first game state
    game.state.start("play");
};
