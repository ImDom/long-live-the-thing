var patterns = [
    [
        'xxxx_x_xx_xxxx_x_xx_xxxx'
    ],
    [
        'x__xx_xxx_xxxxx_xxx__xxx'
    ],
    [
        '__xx__x_x_xxxxx__xxx____',
        '_____________________xxx',
        '______x__________xxxxxxx',
        'xxxxxxx_xxxxxxxxxxxxxxx_'
    ],
    [
        '____xx____xxxxx__xxxxxxx',
        '_xxxxxxxxx______________',
        'x_______________xxxxxxxx'
    ],
    [
        '________xxxxxxx__xxx__xx',
        'xxxxxxx_________________',
        '________xx______________',
        '__xxxxxxxx__xxxxxxx_____',
        'xxxxxxxxxxxxxxxxxxxxx__x'
    ]
];

// 3 blocks (45px wide) per second
var SPEED = -(45 * 3);  // This speed has to work with Player jump force and gravity

var BLOCK_SIZE = 45;
var PATTERN_LENGTH = 24;

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

    game.time.events.loop(((BLOCK_SIZE * PATTERN_LENGTH) / Math.abs(SPEED)) * 1000, this.addPattern, this);
};

Obstacles.prototype = {
    update: function () {},

    addPattern: function () {
        var patternIndex = Math.floor(Math.random() * patterns.length);
        var pattern = patterns[patternIndex];
        console.log("Making pattern", patternIndex, patterns.length, pattern);

        for (var rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
            var row = pattern[rowIndex];

            if (row.length !== PATTERN_LENGTH) {
                throw new Error("Row length has to be " + PATTERN_LENGTH);
            }

            for (var colIndex = 0; colIndex < row.length; colIndex++) {
                var part = row[colIndex];
                var kill = false;
                var sprite;

                switch (part) {
                    case "x":
                        sprite = game.add.tileSprite(
                            game.world.width + (45 * colIndex),
                            game.world.height - 10 - BLOCK_SIZE - (BLOCK_SIZE * ((pattern.length - 1) - rowIndex)),
                            BLOCK_SIZE,
                            BLOCK_SIZE,
                            "obstacle"
                        );
                        break;

                    case "#":
                        kill = true;
                        sprite = game.add.tileSprite(
                            game.world.width + (BLOCK_SIZE * colIndex),
                            game.world.height - 10 - BLOCK_SIZE - (BLOCK_SIZE * ((pattern.length - 1) - rowIndex)),
                            BLOCK_SIZE,
                            BLOCK_SIZE,
                            "danger"
                        );
                        break;

                    case "_":
                        // Nothing
                        break;
                }

                if (sprite) {
                    sprite.body.velocity.x = SPEED;
                    sprite.body.friction.y = 0;
                    sprite.body.friction.x = 0;
                    sprite.body.immovable = true;

                    if (kill) {
                        this.killGroup.add(sprite);
                    } else {
                        this.blockGroup.add(sprite);
                    }
                }
            }
        }
    },

    addHole: function () {
        this.sprite = game.add.tileSprite(
            game.world.width,
            game.world.height - 10 - 45,
            this.getRandomNumber(this.width.min, this.width.max),
            10,
            "obstacle"
        );

        this.sprite.body.velocity.x = SPEED;
        this.sprite.body.friction.y = 0;
        this.sprite.body.friction.x = 0;
        this.sprite.body.immovable = true;

        this.killGroup.add(this.sprite);
    },

    addBlock: function () {
        var width = this.getRandomNumber(this.width.min, this.width.max);
        var height = this.getRandomNumber(this.height.min, this.height.max);

        this.sprite = game.add.tileSprite(
            game.world.width,
            game.world.height - 10 - height,
            width,
            height,
            "ground"
        );

        this.sprite.body.velocity.x = SPEED;
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
