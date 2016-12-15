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
        this.runners = {};
        this.ghosts = {};

        this.bindController();

        this.showMenu();
    
        //game.sound.play('song');
    },

    showMenu: function () {
        game.paused = true;
        this.menu = game.add.text(
            game.world.width/2, 
            game.world.height/2, 
            'Enter your name on your phone!', 
            { font: '30px Arial', fill: '#fff' }
        );
        this.menu.anchor.setTo(0.5, 0.5);
        this.numPlayers = game.add.text(
            game.world.width/2, 
            game.world.height/2 + 100, 
            '', 
            { font: '20px Arial', fill: '#fff' }
        )
        this.numPlayers.anchor.setTo(0.5, 0.5);
    },

    startCountdown: function () {
        var time = 10;

        if (this.countdownInterval || Object.keys(this.runners).length < 1) {
            return;
        }
        
        var _this = this;
        this.countdownInterval = setInterval(function () {
            _this.menu.destroy();
            console.log("Start timer", time)
            --time;

            if (_this.timerText) {
                _this.timerText.setText('The game starts in ' + time + ' seconds');
            } else {
                _this.timerText = game.add.text(
                    game.world.width/2, 
                    game.world.height/2, 
                    'The game starts in ' + time + ' seconds', 
                    { font: '30px Arial', fill: '#fff' }
                );
                _this.timerText.anchor.setTo(0.5, 0.5);
            }

            if (time <= 0) {
                _this.startGame();
                clearInterval(_this.countdownInterval);
                _this.countdownInterval = undefined;
                _this.timerText.destroy();
            }
        }, 1000);
    },

    startGame: function () {
        if (game.paused) {
            game.paused = false;
            socket.emit("start game");
        }
    },

    bindController: function () {
        // Bind controller
        var _this = this;
        socket.on("new player", function (data) {
            _this.newRunner(data.name);
            _this.startCountdown();
        });

        socket.on("remove player", function (data) {
            _this.removePlayer(data.id);
        });

        socket.on("start game", function (data) {
            _this.startGame();
        });

        socket.on("controller action", function (data) {
            switch (data.action) {
                case "jump":
                    var player = _this.findRunner(data.id);
                    if (player) {
                        player.jump();
                    }
                    break;

                case "freeze":
                    var player = _this.findRandomRunner();
                    console.log("Random player", player)
                    if (player) {
                        player.freeze(gameOptions.freezeMs);
                    }
                    break;
            }
        });
    },

    update: function () {
        this.level.update();
        this.obstacles.update();
        this.ui.update();

        for (var id in this.runners) {
            var player = this.runners[id];
            player.update(this.obstacles.blockGroup, this.obstacles.killGroup, this.level.group);
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
        if (!game.paused) { return; }

        var runnerIndex = Object.keys(this.runners).length;
        if (!this.runners[id] && !this.ghosts[id] && runnerIndex < playerColors.length) {
            this.runners[id] = new Player(
                id,
                runnerIndex,
                this.onRunnerDied.bind(this)
            );
        }
    },

    onRunnerDied: function (id) {
        var runner = this.findRunner(id);
        if (runner) {
            console.log("this runner died:", runner);
            this.ghosts[id] = runner;
            delete this.runners[id];
        }
    },

    removePlayer: function (id) {
        if (this.runners[id]) {
            delete this.runners[id];
        } else if (this.ghosts[id]) {
            delete this.ghosts[id];
        }
    },

    updateNumPlayersText: function () {
        this.numPlayers.setText(Object.keys(this.players).length + " players connected");
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
    game.state.add("play", playState);

    // starting the first game state
    game.state.start("play");
};
