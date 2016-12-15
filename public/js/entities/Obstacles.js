/**
 * Create an obstacle 
 */
Obstacles = function() {
    this.nextSpawnAt = 0;

    this.group = game.add.group();
    this.group.enableBody = true;
    this.group.physicsBodyType = Phaser.Physics.ARCADE;

    this.group.createMultiple(2, 'obstacle', 0, false);

    this.group.setAll('anchor.x', 0.5);
    this.group.setAll('anchor.y', 0.5);
    this.group.setAll('body.velocity.x', -60);
    this.group.setAll('body.friction.x', 0);
    this.group.setAll('body.friction.y', 0);
    this.group.setAll('body.immovable', true);

    game.time.events.loop(100, this.spawn, this);
    game.time.events.loop(50, this.recycle, this);
};

Obstacles.prototype = {
    update: function () {},

    spawn: function () {
        if (this.nextSpawnAt > game.time.now) {
            return;
        }

        this.nextSpawnAt = game.time.now + 2000 - gameOptions.runnerSpeed * 30;
        var newHazard = this.group.getFirstDead();
        var random = game.rnd.integerInRange(45, 485);
        if (newHazard) {
            newHazard.reset(random, -120);
            newHazard.body.gravity.y = 400 + gameOptions.runnerSpeed * 6;
        }
    },

    recycle: function() {
        var child = this.group.getFirstAlive();
        if (child !== null && child.y > game.world.height) {
            child.kill();
        }
    }
};