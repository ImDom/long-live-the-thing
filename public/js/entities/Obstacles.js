// 3 blocks (45px wide) per second
var SPEED = -(45 * 4);  // This speed has to work with Player jump force and gravity

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

    this.addInitialBlocks();
    game.time.events.loop(((BLOCK_SIZE * PATTERN_LENGTH) / Math.abs(SPEED)) * 1000, this.addPattern, this);
};

Obstacles.prototype = {
    update: function () {},

    addInitialBlocks: function () {
        for (var i = 0; i < 48; i++) {
            var sprite = game.add.tileSprite(
                game.math.snapToCeil(BLOCK_SIZE * i, BLOCK_SIZE),
                game.world.height - 10 - BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE,
                "ground"
            );

            sprite.body.velocity.x = SPEED;
            sprite.body.friction.y = 0;
            sprite.body.friction.x = 0;
            sprite.body.immovable = true;

            this.blockGroup.add(sprite);
        }
    },

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
                var sprite, image;

                switch (part) {
                    case "#":
                    case "x":
                        
                        break;

                    case "_":
                        // Nothing
                        break;
                }

                if (part !== "_") {
                    var x = game.world.width + (45 * colIndex);
                    var y = game.world.height - 10 - BLOCK_SIZE - (BLOCK_SIZE * ((pattern.length - 1) - rowIndex));
                    
                    sprite = game.add.tileSprite(
                        game.math.snapToCeil(x, BLOCK_SIZE),
                        y,
                        BLOCK_SIZE,
                        BLOCK_SIZE,
                        part === "#" ? "obstacle" : (rowIndex < 3 ? "cloud" : "ground")
                    );

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
    }
};
