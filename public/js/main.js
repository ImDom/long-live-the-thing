var SP = false;
var game, socket, socketController;

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
        game.load.image("ground", "assets/danger.png");
        game.load.image("background", "assets/sky.png");
        game.load.image("danger", "assets/danger.png");
        game.load.image("obstacle", "assets/ground.png");
        game.load.audio("music", "assets/song.mp3");
        game.load.audio("jump", "assets/jump.wav");
    },

    create: function () {
        // Connect socket
        socket = io.connect('/game');
        socketController = io.connect('/controller');

        // Add the physics engine to all game objects
        game.world.enableBody = true;

        this.level = new Level();
        this.ui = new UI();
        this.obstacles = new Obstacles();
        this.runners = {};
        this.ghosts = {};

        this.music = game.add.audio("music");
        this.music.volume = 0;

        this.bindController();

        this.pauseGame();
        this.showMenu();
        this.gameOver = false;
        this.gameStarted = false;
    },

    pauseGame: function () {
        this.music.stop();
        game.paused = true;
    },

    showMenu: function () {
        this.pauseGame();
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
        );
        this.numPlayers.anchor.setTo(0.5, 0.5);
    },

    startCountdown: function () {
        var time = 10;

        if (this.countdownInterval || (!SP && Object.keys(this.runners).length < 2)) {
            return;
        }
        
        var _this = this;
        this.countdownInterval = setInterval(function () {
            _this.menu.destroy();
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
                _this.timerText = undefined;
            }
        }, 1000);
    },

    startGame: function () {
        if (game.paused) {
            game.paused = false;
            this.gameStarted = true;
            this.music.play();
            socket.emit("start game");
        }
    },

    bindController: function () {
        // Bind controller
        var _this = this;
        socket.on("new player", function (data) {
            _this.newRunner(data.name, data.id);

            if (game.paused && !this.gameStarted) {
                _this.startCountdown();
            }
        });

        socket.on("remove player", function (data) {
            _this.removePlayer(data.id);
        });

        socket.on("start game", function (data) {
            _this.startGame();
        });

        socket.on("restart game", function (data) {
            game.state.start("play");
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
                    console.log("Random player", player);
                    if (player) {
                        player.freeze(gameOptions.freezeMs, data.id);
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
        var keys = Object.keys(this.runners);
        return this.runners[keys[keys.length * Math.random() << 0]];
    },

    newRunner: function (id, socketId) {
        if (!game.paused) { return; }

        var runnerIndex = Object.keys(this.runners).length;
        if (!this.runners[id] && !this.ghosts[id] && runnerIndex < playerColors.length) {
            var player = new Player(
                id,
                socketId,
                runnerIndex,
                this.onRunnerDied.bind(this)
            );

            this.runners[id] = player;
            
            var color = player.color;
            socketController.emit("color", {socketId: socketId, color: color});
        }
    },

    onRunnerDied: function (id) {
        var runner = this.findRunner(id);
        if (runner) {
            console.log("this runner died:", runner);
            runner.time = new Date().getTime();
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
        this.numPlayers.setText(Object.keys(this.runners).length + " players connected");
    },

    checkState: function () {
        if (Object.keys(this.runners).length === (SP ? 0 : 1)) {
            // TODO - All runners except for one are dead
            this.pauseGame();
            this.endGame();
        }
    },

    endGame: function (winner) {
        // It can happen that everyone died at the same time
        var winnerIndex = Object.keys(this.runners)[0];
        var winner;
        if (winnerIndex) {
            winner = this.runners[winnerIndex];
        }

        var ghosts = Object.values(this.ghosts).sort(function(a, b) {
            return b.time - a.time;
        });

        var numGhosts = ghosts.length;
        var numListGhosts = numGhosts > 5 ? 5 : numGhosts;
        
        // Show winner name
        var text = "You all died at the same time! No winner :)";
        if (winner) {
            text = 'Congratulations ' + winner.id + ', you are the winner!'
        }

        this.winnerText = game.add.text(
            game.world.width/2, 
            200,
            text,
            { font: '30px Arial', fill: '#fff' }
        );
        this.winnerText.anchor.setTo(0.5, 0.5);

        // Show rank list
        var rankList = "";
        var startIndex = 1;
        if (winner) {
            rankList = "1. " + winner.id;
            startIndex = 2;
        }

        for (var i = 0; i < numListGhosts; ++i) {
            rankList += "\n" + (i + startIndex) + ". " + ghosts[i].id;
        }

        this.rankList = game.add.text(
            game.world.width/2, 
            300, 
            rankList, 
            { font: '20px Arial', fill: '#fff' }
        );
        this.rankList.anchor.setTo(0.5, 0.5);

        var _this = this;
        setTimeout(function () {
            game.paused = false;
            _this.music.play();
            game.state.restart();
            socket.emit("end game");
        }, 5000);
    }
};


window.onload = function() {
    game = new Phaser.Game(gameOptions.width, gameOptions.height);

    // adding game states
    game.state.add("play", playState);

    // starting the first game state
    game.state.start("play");
};
