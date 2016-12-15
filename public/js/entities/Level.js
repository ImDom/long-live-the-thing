/**
 * Create the Level and move the floor and obstacles
 */
Level = function() {
    this.group = game.add.group();

    //this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');
    this.floor = game.add.tileSprite(
        0,
        game.world.height - gameOptions.floorHeight,
        game.world.width,
        gameOptions.floorHeight,
        'ground'
    );

    game.physics.enable(this.floor, Phaser.Physics.ARCADE);
    this.floor.body.immovable = true;
    this.group.add(this.floor);
};

Level.prototype = {
    update: function () {

    }
};