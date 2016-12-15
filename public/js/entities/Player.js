/**
 * Create the Level and move the floor and obstacles
 */
Player = function(id) {
    this.id = id;
    this.size = 16;
    this.gravity = 450;
    this.jumpForce = -200;
    this.canJump = true;
    this.isDead = false;

    this.runner = game.add.sprite(300, 600 - this.size, "runner");

    this.runner.anchor.set(0.5);
    this.runner.width = this.size;
    this.runner.height = this.size;

    game.physics.enable(this.runner, Phaser.Physics.ARCADE);
    this.runner.body.gravity.y = this.gravity;
};

Player.prototype = {
    update: function (obstaclesGroup, floorGroup) {
        game.physics.arcade.collide(this.runner, obstaclesGroup);
        game.physics.arcade.collide(this.runner, floorGroup);

        if (this.runner.body.touching.down){
            this.canJump = true;
            this.runner.body.velocity.x = 0;
        } else {
            this.runner.body.velocity.x = 0;
        }

        if (this.runner.x < 0 || this.runner.x > 900) {
            this.runner.x = 300;
        }
    },

    jump: function () {
        if (this.canJump) {
            this.canJump = false;
            this.runnerSpeedBeforeJump = this.runner.body.speed;
            console.log(this.runnerSpeedBeforeJump);

            this.runner.body.velocity.y = this.jumpForce;
        }
    },

    buildObstacle: function () {
        if (this.isDead) {
            // TODO
        }
    },

    onHit: function () {
        // DIE
        this.isDead = true;
    }
};

