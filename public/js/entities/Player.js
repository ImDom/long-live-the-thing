/**
 * Create a player
 */
Player = function (id, runnerIndex, onDieCallback) {
    this.id = id;
    this.size = 30;
    this.gravity = 450;
    this.jumpForce = -250;
    this.canJump = true;
    this.isDead = false;
    this.isFrozen = false;
    this.onDieCallback = onDieCallback;

    //this.runner = game.add.sprite(300, game.world.height - this.size, "runner");
    this.runner = game.add.sprite(300, game.world.height - this.size, "runnerSS");
    this.runner.animations.add('walk');

    this.runner.animations.play('walk', 20, true);

    this.runner.tint = playerColors[runnerIndex];
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

        // if the hero has its feet on the ground, it can jump
        if (this.runner.body.touching.down) {
            if (this.isFrozen === false) {
                this.canJump = true;
            }
            this.runner.body.velocity.x = 5;
            this.runner.animations.play('walk', 20, true);
        } else {
            this.runner.body.velocity.x = 10;
        }

        if (this.runner.x < 0) {
            this.die();
        } else if (this.runner.x > 900) {
            this.runner.x = 300;
        }

        return this.isDead;
    },

    die: function () {
        this.isDead = true;
        this.runner.kill();
        this.onDieCallback(this.id);
    },

    jump: function () {
        if (this.canJump) {
            this.canJump = false;
            this.runner.animations.stop('walk');
            this.runnerSpeedBeforeJump = this.runner.body.speed;

            this.runner.body.velocity.y = this.jumpForce;
        }
    },

    freeze: function(milliSecs) {
        console.log("freezing for ", milliSecs)
        var _this = this;
        _this.isFrozen = true;
        setTimeout(function() { _this.isFrozen = false; }, milliSecs)
    },

    buildObstacle: function () {
        if (this.isDead) {
            // TODO
        }
    }
};

