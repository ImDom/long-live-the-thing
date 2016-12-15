function Field (game) {
    this.fieldGroup = game.add.group();

    var _this = this;
    setInterval(function () {
        _this.fieldGroup.add(new Obstacle().sprite);
    }, 3000);
}

function Obstacle () {
    this.sprite = game.add.tileSprite(
        900 + 40,
        600 - 40,
        40,
        40,
        "ground"
    );

    this.sprite.body.velocity.x = -60;
    this.sprite.body.friction.y = 0;
    this.sprite.body.friction.x = 0;
    this.sprite.body.immovable = true;

    // let's enable ARCADE physics on floors too
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
}