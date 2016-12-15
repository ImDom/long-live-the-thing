function Player (id, game, gameOptions) {
    this.id = id;
    this.squareSize = 16,
    this.squareSpeed = 170,
    this.squareGravity = 450;
    this.jumpForce = -210;
    this.jumpTime = 500;
    this.floor = 0;

    this.runner = game.add.sprite(gameOptions.floorX + this.squareSize / 2, gameOptions.floorY[0] - this.squareSize / 2, "tile");
    
    this.runner.anchor.set(0.5);
    this.runner.width = this.squareSize;
    this.runner.height = this.squareSize;
    this.runner.canJump = true;

    game.physics.enable(this.runner, Phaser.Physics.ARCADE);
    this.runner.body.velocity.x = this.squareSpeed;
    this.runner.body.gravity.y = this.squareGravity;
}

Player.prototype.update = function (groundGroup) {
    // Here we update the game 60 times per second
    // making the hero collide with floors so it won't fall down
    game.physics.arcade.collide(this.runner, groundGroup);

    // if the hero leaves the floor to the right or to the left...
    if ((this.runner.x > gameOptions.floorX + gameOptions.floorWidth && this.floor % 2 == 0) ||
        (this.runner.x < gameOptions.floorX && this.floor % 2 == 1))
    {
        // increasing floor number or setting it back to zero
        this.floor = (this.floor + 1) % gameOptions.floorY.length;

        // adjusting hero speed according to floor number: from left to right on even floors, from right to left on odd floors
        this.runner.body.velocity.x = (this.floor % 2 == 0) ?
            this.squareSpeed :
            -this.squareSpeed;

        // no vertical velocity
        this.runner.body.velocity.y = 0;

        // the hero can jump again
        this.runner.canjump = true;

        // adjusting hero vertical and horizontal position
        this.runner.y = gameOptions.floorY[this.floor] - this.squareSize / 2;
        this.runner.x = (this.floor % 2 == 0) ?
            gameOptions.floorX :
            gameOptions.floorX + gameOptions.floorWidth;

        // stopping the jump tween if running
        if (this.jumpTween && this.jumpTween.isRunning) {
            this.jumpTween.stop();
            this.runner.angle = 0;
        }
    }

    // if the hero as its feet on the ground, it can jump
    if (this.runner.body.touching.down){
        this.runner.canJump = true;
    }
}

Player.prototype.jump = function () {
    // if the hero can jump...
    if (this.runner.canJump) {
        // preventing it to jump while in the air
        this.runner.canJump = false;

        // adding a vertical force to the player
        this.runner.body.velocity.y = this.jumpForce;

        // setting a jump rotation angle just to make the square rotate
        var jumpAngle = this.floor % 2 == 0 ? 90 : -90;

        // using a tween to rotate the player
        this.jumpTween = game.add.tween(this.runner).to({
            angle: this.runner.angle + jumpAngle
        }, this.jumpTime, Phaser.Easing.Linear.None, true);
    }
}