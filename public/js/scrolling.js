var game, socket;

// global object with all game options
var gameOptions = {
    // game width
    gameWidth: 1500,

    // game height
    gameHeight: 900,

    // width of each floor
    floorWidth: 1500,

    // height of each floor
    floorHeight: 10,

    // array with vertical floors position
    floorY: [440,890],

    // horizontal floor position
    floorX: 0,

    // size of the hero
    squareSize: 24,

    // horizontal speed of the hero
    squareSpeed: 170,

    // game gravity
    squareGravity: 450,

    // force to be applied at each jump
    jumpForce: -210,

    // jump tween length, in milliseconds
    jumpTime: 200,

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

        // we start on the first floor
        this.levelFloor = 0;

        // adding the hero on the first floor
        this.theRunner = game.add.sprite(
            gameOptions.floorX + gameOptions.squareSize / 2,
            gameOptions.floorY[0] - gameOptions.squareSize / 2,
            "runner"
        );

        // setting hero registration point
        this.theRunner.anchor.set(0.5);

        // setting hero width and height
        this.theRunner.width = gameOptions.squareSize;
        this.theRunner.height = gameOptions.squareSize;

        // can the hero jump?
        this.theRunner.canJump = true;

        // Set the background color to blue
        game.stage.backgroundColor = gameOptions.backgroundColor;

        // enabling ARCADE physics on the hero
        game.physics.enable(this.theRunner, Phaser.Physics.ARCADE);

        // Add the physics engine to all game objects
        game.world.enableBody = true;

        // setting hero horizontal velocity
        this.theRunner.body.velocity.x = gameOptions.squareSpeed;

        // gravity applied to the square
        this.theRunner.body.gravity.y = gameOptions.squareGravity;

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
        socket.on("controller action", function (data) {
            switch (data.action) {
                case "jump":
                    _this.squareJump();
                    break;
            }
        });
    },

    update: function() {
        // Here we update the game 60 times per second
        // making the hero collide with floors so it won't fall down
        game.physics.arcade.collide(this.theRunner, this.groundGroup);

        // if the hero leaves the floor to the right or to the left...
        if ((this.theRunner.x > gameOptions.floorX + gameOptions.floorWidth && this.levelFloor % 2 == 0) ||
            (this.theRunner.x < gameOptions.floorX && this.levelFloor % 2 == 1))
        {

            // increasing floor number or setting it back to zero
            this.levelFloor = (this.levelFloor + 1) % gameOptions.floorY.length;

            // adjusting hero speed according to floor number: from left to right on even floors, from right to left on odd floors
            this.theRunner.body.velocity.x = (this.levelFloor % 2 == 0) ?
                gameOptions.squareSpeed :
                -gameOptions.squareSpeed;

            // no vertical velocity
            this.theRunner.body.velocity.y = 0;

            // the hero can jump again
            this.theRunner.canjump = true;

            // adjusting hero vertical and horizontal position
            this.theRunner.y = gameOptions.floorY[this.levelFloor] - gameOptions.squareSize / 2;
            this.theRunner.x = (this.levelFloor % 2 == 0) ?
                gameOptions.floorX :
                gameOptions.floorX + gameOptions.floorWidth;

            // stopping the jump tween if running
            if (this.jumpTween && this.jumpTween.isRunning) {
                this.jumpTween.stop();
                this.theRunner.angle = 0;
            }
        }

        // if the hero as its feet on the ground, it can jump
        if (this.theRunner.body.touching.down){
            this.theRunner.canJump = true;
        }
    },

    squareJump: function () {
        // if the hero can jump...
        if (this.theRunner.canJump) {
            // preventing it to jump while in the air
            this.theRunner.canJump = false;

            // adding a vertical force to the player
            this.theRunner.body.velocity.y = gameOptions.jumpForce;

            // setting a jump rotation angle just to make the square rotate
            var jumpAngle = this.levelFloor % 2 == 0 ? 90 : -90;

            // using a tween to rotate the player
            this.jumpTween = game.add.tween(this.theRunner).to({
                angle: this.theRunner.angle + jumpAngle
            }, gameOptions.jumpTime, Phaser.Easing.Linear.None, true);
        }
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
