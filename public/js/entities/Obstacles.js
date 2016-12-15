/**
 * Create an obstacle 
 */
Obstacles = function(game) {
    this.game = game;
    this.nextSpawnAt = 0;
};

Obstacles.prototype = {
    create: function () {
        this.group = this.game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;

        this.group.createMultiple(2, 'obstacle', 0, false);
        
        this.group.setAll('anchor.x', 0.5);
        this.group.setAll('anchor.y', 0.5);
        
        this.game.time.events.loop(100, this.spawn, this);
        this.game.time.events.loop(50, this.recycle, this);
    },

    update: function () {},

    spawn: function () {
        if (this.nextSpawnAt > this.game.time.now) {
            return;
        }

        this.nextSpawnAt = this.game.time.now + 2000 - player.speed * 30;
        var newHazard = this.group.getFirstDead();
        var random = this.game.rnd.integerInRange(45, 485);
        if (newHazard) {
            newHazard.reset(random, -120);
            newHazard.body.gravity.y = 400 + player.speed * 6;
        }
    },

    recycle: function() {
        var child = this.group.getFirstAlive();
        if (child !== null && child.y > this.game.world.height) {
            child.kill();
        }
    }
};