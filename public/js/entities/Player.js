/**
 * Create a player
 */
Player = function (id, runnerIndex, onDieCallback) {
    this.id = id;
    this.size = 30;
    this.gravity = 1000;
    this.jumpForce = -350;
    this.canJump = true;
    this.isDead = false;
    this.isFrozen = false;
    this.onDieCallback = onDieCallback;

    //this.runner = game.add.sprite(300, game.world.height - this.size, "runner");
    this.runner = game.add.sprite(game.world.width / 2, game.world.height / 1.5, "runnerSS");
    this.runner.animations.add('walk');

    this.runner.tint = playerColors[runnerIndex];
    this.runner.anchor.set(0.5);
    this.runner.width = this.size;
    this.runner.height = this.size;

    game.physics.enable(this.runner, Phaser.Physics.ARCADE);
    this.runner.body.gravity.y = this.gravity;

    this.jumpSound = game.add.audio("jump");
    this.jumpSound.volume = 0.1;
};

Player.prototype = {
    update: function (blockGroup, killGroup, floorGroup) {
        game.physics.arcade.collide(this.runner, blockGroup);
        game.physics.arcade.collide(this.runner, killGroup);  // Do do something else with these
        game.physics.arcade.collide(this.runner, floorGroup, this.die.bind(this));
        this.runner.body.velocity.x = 10;

        // if the hero has its feet on the ground, it can jump
        if (this.runner.body.touching.down) {
            if (this.isFrozen === false) {
                this.canJump = true;
            }
            this.runner.animations.play('walk', 20, true);
        }

        if (this.runner.x < 0) {
            this.die();
        } else if (this.runner.x > game.world.width) {
            this.runner.x = game.world.width;
        }

        return this.isDead;
    },

    die: function () {
        if (game.time.elapsedMS > 10000) {
            this.isDead = true;
            this.runner.kill();
            this.onDieCallback(this.id);
        }
    },

    jump: function () {
        if (this.canJump) {
            this.jumpSound.play();
            this.canJump = false;
            this.runner.animations.stop('walk');
            this.runnerSpeedBeforeJump = this.runner.body.speed;

            this.runner.body.velocity.y = this.jumpForce;
        }
    },

    freeze: function(milliSecs, freezerId) {
        console.log("freezing ", milliSecs, freezerId)
        var _this = this;
        
        var popUp = game.add.text(
            game.world.width/2, 
            game.world.height/2, 
            freezerId + " froze " + this.id + " for " + Math.min(milliSecs / 1000) + "!", 
            { font: '30px Arial', fill: '#fff' }
        );
        popUp.anchor.setTo(0.5, 0.5);
        _this.isFrozen = true;

        setTimeout(function() { 
            _this.isFrozen = false;
            popUp.destroy();
        }, milliSecs);
    },

    buildObstacle: function () {
        if (this.isDead) {
            // TODO
        }
    }
};

