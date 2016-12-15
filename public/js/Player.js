function Player (id, game, gameOptions) {
    this.id = id;
    this.squareSize = 16,
    this.squareSpeed = 170,
    this.squareGravity = 450;
    this.jumpForce = -400;
    this.jumpTime = 500;

    this.runner = game.add.sprite(300, 600 - this.squareSize, "runner");
    
    this.runner.anchor.set(0.5);
    this.runner.width = this.squareSize;
    this.runner.height = this.squareSize;
    this.runner.canJump = true;

    game.physics.enable(this.runner, Phaser.Physics.ARCADE);
    this.runner.body.gravity.y = this.squareGravity;
}

Player.prototype.update = function (groundGroup, fieldGroup) {
    // Here we update the game 60 times per second
    // making the hero collide with floors so it won't fall down
    game.physics.arcade.collide(this.runner, groundGroup);
    game.physics.arcade.collide(this.runner, fieldGroup);

    // if the hero as its feet on the ground, it can jump
    if (this.runner.body.touching.down){
        this.runner.canJump = true;
        var _this = this;
        this.runner.body.velocity.x = 0;
    }

    if (this.runner.x < 0) {
        this.runner.x = 300;
    } 
}

Player.prototype.jump = function () {
    // if the hero can jump...
    if (this.runner.canJump) {
        // preventing it to jump while in the air
        this.runner.canJump = false;

        // adding a vertical force to the player
        this.runner.body.velocity.y = this.jumpForce;
        this.runner.body.velocity.x = 50;
    }
}