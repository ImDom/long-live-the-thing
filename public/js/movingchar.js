var game, socket;

// global object with all game options
var gameOptions = {
    // game width
    gameWidth: 900,

    // game height
    gameHeight: 600,

    // width of each floor
    floorWidth: 900,

    // height of each floor
    floorHeight: 10,

    // array with vertical floors position
    floorY: [290,590],

    // horizontal floor position
    floorX: 0,

    // game background
    backgroundColor: '#3598db'
};

var RunnerGame = {
    preload: function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.load.image("runner", "assets/runner.png");
        game.load.image("ground", "assets/ground.png");
    },

    create: function() {
        socket = io.connect('/game');

        // creation of a group where we will place all floors
        this.groundGroup = game.add.group();

        // adding the hero on the first floor
        this.players = [];

        // Add the physics engine to all game objects
        game.world.enableBody = true;

        // time to create the floors
        for(var i = 0; i < gameOptions.floorY.length; i++){
            // each floor is a tile sprite
            var floor = game.add.tileSprite(
                gameOptions.floorX,
                gameOptions.floorY[i],
                gameOptions.floorWidth,
                gameOptions.floorHeight,
                "ground"
            );

            // let's enable ARCADE physics on floors too
            game.physics.enable(floor, Phaser.Physics.ARCADE);

            // floors can't move
            floor.body.immovable = true;

            // adding the floor to ground group
            this.groundGroup.add(floor);
        }

        // Bind controller
        var _this = this;
        socket.on("new player", function (data) {
            _this.newPlayer(data.id);
        });

        socket.on("remove player", function (data) {
            _this.removePlayer(data.id);
        });

        socket.on("controller action", function (data) {
            console.log("controller action", data);
            switch (data.action) {
                case "jump":
                    _this.findPlayer(data.id).jump();
                    break;
            }
        });
    },

    update: function() {
        _this = this;
        for (var id in this.players) {
            var player = this.players[id];
            player.update(_this.groundGroup);
        }
    },

    findPlayer: function(id) {
        console.log(id, this.players[id])
        return this.players[id];
    },

    newPlayer: function (id) {
        this.players[id] = new Player(id, game, gameOptions);
    },

    removePlayer: function (id) {
        delete this.players[id];
    }
};

// when the window loads
window.onload = function() {
    // game creation
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);

    // adding game state
    game.state.add("RunnerGame", RunnerGame);

    // starting game state
    game.state.start("RunnerGame");
};