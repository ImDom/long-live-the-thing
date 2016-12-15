/**
 * Generates obstacles
 */
Obstacles = function() {
    this.width = {
        min: 20,
        max: 100
    };

    this.height = {
        min: 20,
        max: 70
    };

    this.blockGroup = game.add.group();
    this.killGroup = game.add.group();

    var _this = this;
    setInterval(function () {
        _this.addBlock();
    }, this.getRandomNumber(200, 1000));
};

Obstacles.prototype = {
    update: function () {},

    addHole: function () {
        this.sprite = game.add.tileSprite(
            game.world.width + 50,
            game.world.height - 45,
            this.getRandomNumber(this.width.min, this.width.max),
            10,
            "obstacle"
        );

        this.sprite.body.velocity.x = -200;
        this.sprite.body.friction.y = 0;
        this.sprite.body.friction.x = 0;
        this.sprite.body.immovable = true;

        this.killGroup.add(this.sprite);
    },

    addBlock: function () {
        var width = this.getRandomNumber(this.width.min, this.width.max);
        var height = this.getRandomNumber(this.height.min, this.height.max);

        this.sprite = game.add.tileSprite(
            game.world.width + width,
            game.world.height - height,
            width,
            height,
            "ground"
        );

        this.sprite.body.velocity.x = -200;
        this.sprite.body.friction.y = 0;
        this.sprite.body.friction.x = 0;
        this.sprite.body.immovable = true;

        this.blockGroup.add(this.sprite);
    },

    addBomb: function () {

    },

    getRandomNumber: function (min, max) {
        return Math.random() * (max - min) + min;
    }
};

/*
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
};*/
