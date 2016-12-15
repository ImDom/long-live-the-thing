var game, socket;

var gameOptions = {
    width: 1024,
    height: 576,
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
    },

    create: function () {
        // Connect socket
        socket = io.connect('/game');

        this.level = new Level(game);
        this.level.create();
        this.ui = new UI(game);
        this.ui.create();

        this.obstacles = new Obstacles(game);
        this.obstacles.create();

        // TODO - Create player via controller action "start"
        this.player = new Player(game);
        this.player.create();

        // Bind controller
        var _this = this;
        socket.on("controller action", function (data) {
            switch (data.action) {
                case "jump":
                    _this.squareJump();
                    break;
            }
        });
    },

    update: function () {
        this.level.update();
        this.player.update();
        this.ui.update();
        this.checkState();
        game.physics.arcade.collide(this.player.sprite, this.obstacles.group, this.player.onHit);
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
