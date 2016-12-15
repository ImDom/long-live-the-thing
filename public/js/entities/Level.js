/**
 * Create the Level and move the floor and obstacles
 */
Level = function() {
    //this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');
    this.floor = game.add.tileSprite(
        0,
        game.world.height - gameOptions.floorHeight,
        game.world.width, gameOptions.floorHeight,
        'ground'
    );

    this.floor.body.immovable = true;
    game.physics.enable(this.floor, Phaser.Physics.ARCADE);

    // Add the physics engine to all game objects
    game.world.enableBody = true;
};

Level.prototype = {
    update: function () {

    }
};