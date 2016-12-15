/**
 * Create the Level and move the floor and obstacles
 */
Player = function(game) {
    this.game = game;
    this.isDead = false;
    this.canJump = true;
    this.jumpTime = 200;
    this.gravity = 450;
    this.velocityY = 170;
};

Player.prototype = {
    create: function () {
        this.sprite = game.add.sprite(game.world.centerX, 860, 'player');
        this.sprite.anchor.setTo(0.5, 0.5);

        this.theRunner.body.velocity.x = 0;
        this.theRunner.body.velocity.y = this.velocityY;
        this.sprite.body.gravity.y = this.gravity;
        
        game.physics.enable(this.theRunner, Phaser.Physics.ARCADE);

        // TODO - bind jump with websocket
        game.input.onUp.add(this.jump, this);
    },

    update: function () {
        // TODO
    },

    jump: function () {
        if (this.canJump) {
            this.canJump = false;
            // TODO
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

