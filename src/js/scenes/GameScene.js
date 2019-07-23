// https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-fire-being-kind-with-players-by-setting-its-body-smaller-than-the-image/
import { CST } from "../constants/CST";
import { addAnimation, SlimegCharacterSprite } from "../Sprite";
import { ANIMATIONS } from "../animation";
import { platformerInput } from "../scriptComponent/platformerInput";
import { platformerInputBot } from "../scriptComponent/platformerInputBot";

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
        this.addLevel();
        this.addSlimeAnimation();
        this.setupPhysics();
    }

    setupPhysics() {
        this.topLayer.setCollisionByProperty({ collision: true });
        this.physics.add.collider(this.movingSprites, this.topLayer);
    }

    addSlimeAnimation() {
        const components = [platformerInput];
        addAnimation(this, ANIMATIONS.slimeg);
        this.slime = new SlimegCharacterSprite(this, 80, 200, components);
        this.slime.setScale(0.2);

        this.cameras.main.startFollow(this.slime);

        const componentsBot = [platformerInputBot];
        this.slimeb = new SlimegCharacterSprite(this, 200, 200, componentsBot);
        this.slimeb.setScale(0.5);
        this.slimeb.tint = Math.random() * 0xffffff;

        this.movingSprites = this.physics.add.group({
            collideWorldBounds: true,
            dragX: 140
        });
        this.movingSprites.add(this.slime);
        this.movingSprites.add(this.slimeb);
    }

    addLevel() {
        this.map = this.add.tilemap("map");

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const tiles = this.map.addTilesetImage("sewer_tileset", "tiles");

        this.bottomLayer = this.map
            .createStaticLayer("Bottom", [tiles], 0, 0)
            .setDepth(-1);
        this.topLayer = this.map
            .createStaticLayer("Top", [tiles], 0, 0)
            .setDepth(-1);

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
    }
}
