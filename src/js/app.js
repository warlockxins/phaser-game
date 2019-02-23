// require("./app_t");

// for map data will try to use
//labs.phaser.io/edit.html?src=src/game%20objects\tilemap\static\tiled-json-map.js

const config = {
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
    this.load.image("tiles", "assets/sewer_tileset.png");
    this.load.tilemapTiledJSON("map", "assets/sewers.json");
}

function create() {
    addLevel(this);
    addSlimeAnimation(this);
    setupControls(this);
}

const setupControls = scene => {
    scene.cameras.main.setBounds(
        0,
        0,
        scene.map.widthInPixels,
        scene.map.heightInPixels
    );

    var cursors = scene.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: scene.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    scene.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    var help = scene.add.text(16, 16, "Arrow keys to scroll", {
        fontSize: "18px",
        padding: { x: 10, y: 5 },
        backgroundColor: "#000000",
        fill: "#ffffff"
    });
    help.setScrollFactor(0);
};

const addLevel = scene => {
    scene.map = scene.make.tilemap({ key: "map" });

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    const tiles = scene.map.addTilesetImage("sewer_tileset", "tiles");

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    scene.map.createStaticLayer(0, tiles, 0, 0);
};

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

    this.controls.update(delta);
}
