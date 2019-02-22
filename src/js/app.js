require("./app_t");
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.atlas("slimeg", "assets/slimeg.png", "assets/slimeg.json");
}

function create() {
    addSlimeAnimation(this);
}

const addSlimeAnimation = scene => {
    scene.slime = scene.add.sprite(80, 400, "slimeg", "slime1.png");
    const frameNames = scene.anims.generateFrameNames("slimeg", {
        start: 1,
        end: 5,
        zeroPad: 1,
        prefix: "slime",
        suffix: ".png"
    });

    scene.anims.create({
        key: "walk",
        frames: frameNames,
        frameRate: 3,
        repeat: -1
    });
    scene.slime.anims.play("walk");
    scene.slime.setScale(0.5, 0.5);
};

function update(time, delta) {
    this.slime.x -= delta / 8;
    if (this.slime.x < 0) {
        this.slime.x = 800;
    }
}
