var game, socket;
 
// global object with all game options
var gameOptions = {
    // game width
    gameWidth: 640,

    // game height 
    gameHeight: 480,

    // width of each floor
    floorWidth: 640,

    // height of each floor
    floorHeight: 20,

    // array with vertical floors potision
    floorY: [92,184,276,368,460],

    // horizontal floor position
    floorX: 0,

    // size of the hero
    squareSize: 16,

    // horizontal speed of the hero
    squareSpeed: 170,

    // game gravity
    squareGravity: 450,

    // force to be applied at each jump
    jumpForce: -210,

    // jump tween length, in milliseconds
    jumpTime: 500
};
 
// when the window loads
window.onload = function() {
    // game creation	
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);

    // adding game state
    game.state.add("TheGame", TheGame);

    // starting game state
    game.state.start("TheGame");
}
 
var TheGame = function(){};
 
TheGame.prototype = {
    // when the state preloads
    preload: function(){

        // setting the game on maximum scale mode
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true; 

        // preloading the only game assets, a tile which will be used both for the square and the floor
        game.load.image("tile", "assets/tile.png");   
    }, 

    // once the state is ready
    create: function(){
        socket = io.connect('/game');

        // creation of a group where we will place all floors
        this.groundGroup = game.add.group();		

        // we start on the first floor
        this.levelFloor = 0;

        // adding the hero on the first floor
        this.theSquare = game.add.sprite(gameOptions.floorX + gameOptions.squareSize / 2, gameOptions.floorY[0] - gameOptions.squareSize / 2, "tile");

        // setting hero registration point
        this.theSquare.anchor.set(0.5);

        // setting hero width and height
        this.theSquare.width = gameOptions.squareSize;
        this.theSquare.height = gameOptions.squareSize;

        // chen the hero jump?
        this.theSquare.canJump = true;

        // enabling ARCADE physics on the hero
        game.physics.enable(this.theSquare, Phaser.Physics.ARCADE);

        // setting hero horizontal velocity
        this.theSquare.body.velocity.x = gameOptions.squareSpeed;

        // gravity applied to the square
        this.theSquare.body.gravity.y = gameOptions.squareGravity;

        // time to create the floors
        for(i = 0; i < gameOptions.floorY.length; i++){

            // each floor is a tile sprite
            var floor = game.add.tileSprite(gameOptions.floorX, gameOptions.floorY[i], gameOptions.floorWidth, gameOptions.floorHeight, "tile");	

            // let's enable ARCADE physics on floors too
            game.physics.enable(floor, Phaser.Physics.ARCADE);

            // floors can't move
            floor.body.immovable = true;

            // adding the floor to ground group
            this.groundGroup.add(floor);			
        }

        socket.on("controller action", function (data) {
            switch (data.action) {
                case "jump":
                    this.squareJump();
                break;
            }
        });
    },

    // at each frame
    update: function () {
        // making the hero collide with floors so it won't fallo down
        game.physics.arcade.collide(this.theSquare, this.groundGroup);

        // if the hero leaves the floor to the right or to the left...
        if ((this.theSquare.x > gameOptions.floorX + gameOptions.floorWidth && this.levelFloor % 2 == 0) || (this.theSquare.x < gameOptions.floorX && this.levelFloor % 2 == 1)){

            // increasing floor number or setting it back to zero
            this.levelFloor = (this.levelFloor + 1) % gameOptions.floorY.length; 

            // adjusting hero speed according to floor number: from left to right on even floors, from right to left on odd floors
            this.theSquare.body.velocity.x = (this.levelFloor % 2 == 0) ? gameOptions.squareSpeed : -gameOptions.squareSpeed; 

            // no vertical velocity
            this.theSquare.body.velocity.y = 0;

            // the hero can jump again 
            this.theSquare.canjump = true; 

            // adjusting hero vertical and horizontal position
            this.theSquare.y = gameOptions.floorY[this.levelFloor] - gameOptions.squareSize / 2;
            this.theSquare.x = (this.levelFloor % 2 == 0) ? gameOptions.floorX : gameOptions.floorX + gameOptions.floorWidth;   

            // stopping the jump tween if running
            if (this.jumpTween && this.jumpTween.isRunning) {
                this.jumpTween.stop();
                this.theSquare.angle = 0;
            }    
        }

        // if the hero as its feet on the ground, it can jump
        if (this.theSquare.body.touching.down){
            this.theSquare.canJump = true;
        }
    },

    // when the player jumps
    squareJump: function () {
        // if the hero can jump...
        if (this.theSquare.canJump) {
            // preventing it to jump while in the air
            this.theSquare.canJump = false;

            // adding a vertical force to the player
            this.theSquare.body.velocity.y = gameOptions.jumpForce;

            // setting a jump rotation angle just to make the square rotate
            var jumpAngle = this.levelFloor % 2 == 0 ? 90 : -90;

            // using a tween to rotate the player
            this.jumpTween = game.add.tween(this.theSquare).to({
                angle: this.theSquare.angle + jumpAngle
            }, gameOptions.jumpTime, Phaser.Easing.Linear.None, true);
        }
    }    
}
