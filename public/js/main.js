var game, socket;

var gameOptions = {
    width: 1024,
    height: 576,
    floorHeight: 10,
    gravity: 450,
    runnerSpeed: 100,
    freezeMs: 3 * 1000
};

var playState = {
    preload: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.load.spritesheet('runnerSS', 'assets/runner_spritesheet.png', 50, 50);
        game.load.image("runner", "assets/runner.png");
        game.load.image("ground", "assets/ground.png");
        game.load.image("background", "assets/sky.png");
        game.load.image("obstacle", "assets/obstacle.png");
        game.load.audio("song", "assets/song.mp3");
    },

    create: function () {
        // Connect socket
        socket = io.connect('/game');

        game.paused = true;

        // Add the physics engine to all game objects
        game.world.enableBody = true;

        this.level = new Level();
        this.ui = new UI();
        this.obstacles = new Obstacles();
        this.runners = [];
        this.ghosts = [];

        this.bindController();

        //game.sound.play('song');
    },

    bindController: function () {
        // Bind controller
        var _this = this;
        socket.on("new player", function () {
            _this.newRunner(socket.id);
        });

        socket.on("remove player", function () {
            _this.removePlayer(socket.id);
        });

        socket.on("controller action", function (data) {
            switch (data.action) {
                case "jump":
                    var player = _this.findRunner(socket.id);
                    if (player) {
                        game.paused = false;
                        player.jump();
                    }
                    break;
                case "freeze":
                    var player = _this.findRandomRunner();
                    console.log("Random player", player)
                    if (player) {
                        player.freeze(gameOptions.freezeMs);
                    }
                    
            }
        });
    },

    update: function () {
        this.level.update();
        this.ui.update();

        for (var id in this.runners) {
            var player = this.runners[id];
            player.update(this.obstacles.group, this.level.group);
        }

        this.checkState();
    },

    findRunner: function (id) {
        return this.runners[id];
    },

    findRandomRunner: function() {
        var keys = Object.keys(this.runners)
        return this.runners[keys[ keys.length * Math.random() << 0]];
    },

    newRunner: function (id) {
        if (!this.runners[id] && !this.ghosts[id]) {
            this.runners[id] = new Player(id, this.onRunnerDied.bind(this));
        }
    },

    onRunnerDied: function (id) {
        var runner = this.findRunner(id);
        if (runner) {
            console.log("this runner died:", runner);
            this.ghosts.push(runner);
            delete this.runners[id];
        }
    },

    removePlayer: function (id) {
        if (this.runners.indexOf(id) > -1) {
            delete this.runners[id]
        } else if (this.ghosts.indexOf(id) > -1) {
            delete this.ghosts[id];
        }
    },

    checkState: function () {
        if (Object.keys(this.runners).length === 0) {
            // TODO - All runners are dead, endgame
            game.paused = true;
        }
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
