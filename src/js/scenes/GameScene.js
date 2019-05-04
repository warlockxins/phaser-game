import { CST } from "../constants/CST";
import { CharacterSprite, addAnimation } from "../Sprite";
import { ANIMATIONS } from "../animation";

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }

    init(data) {
        console.log("data passed to this scene", data);
    }

    preload() {}
    create() {
        addLevel(this);
        addSlimeAnimation(this);
        setupControls(this);
        this.setupPhysics();
    }

    update(time, delta) {
        if (this.keyboard.D.isDown === true) {
            this.slime.setVelocityX(100);
            this.slime.flipX = true;
            this.slime.anims.play("walk", true);
        }
        if (this.keyboard.A.isDown === true) {
            this.slime.setVelocityX(-100);
            this.slime.flipX = false;
            this.slime.anims.play("walk", true);
        }
        if (this.keyboard.W.isDown === true) {
            this.slime.setVelocityY(-140);
            this.slime.anims.stop();
        }

        if (!this.keyboard.A.isDown && !this.keyboard.D.isDown) {
            this.slime.setVelocityX(0);
            this.slime.anims.play("stand", true);
        }
    }

    setupPhysics() {
        this.physics.add.collider(this.slime, this.topLayer);
        this.topLayer.setCollisionByProperty({ collision: true });
    }
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

    scene.keyboard = scene.input.keyboard.addKeys("W, A, S, D");
};

const addLevel = scene => {
    scene.map = scene.add.tilemap("map");

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    const tiles = scene.map.addTilesetImage("sewer_tileset", "tiles");

    scene.bottomLayer = scene.map
        .createStaticLayer("Bottom", [tiles], 0, 0)
        .setDepth(-1);
    scene.topLayer = scene.map
        .createStaticLayer("Top", [tiles], 0, 0)
        .setDepth(-1);
};

const addSlimeAnimation = scene => {
    addAnimation(scene, ANIMATIONS.slimeg);
    scene.slime = new CharacterSprite(scene, 80, 400, "slimeg", "slime1.png");
    scene.slime.setScale(0.5, 0.5);
};
