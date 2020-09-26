// https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-fire-being-kind-with-players-by-setting-its-body-smaller-than-the-image/
import { CST } from "../constants/CST";
import { addAnimation, SlimegCharacterSprite } from "../Sprite";
import { ANIMATIONS } from "../animation";

import { ScriptComponent } from "../scriptComponent/scriptComponent";
import { platformerInput } from "../scriptComponent/platformerInput";
import { platformerInputBot } from "../scriptComponent/platformerInputBot";

export class GameScene extends Phaser.Scene {
    map!: Phaser.Tilemaps.Tilemap;
    topLayer!: Phaser.Tilemaps.StaticTilemapLayer;
    bottomLayer!: Phaser.Tilemaps.StaticTilemapLayer;
    movingSprites!: Phaser.Physics.Arcade.Group;

    slime?: SlimegCharacterSprite;

    constructor() {
        super({
            key: CST.SCENES.GAME,
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
        this.physics.add.collider(
            this.movingSprites,
            this.topLayer
            // (collider1, collider2) => {
            // const body1: Phaser.Physics.Arcade.Body = collider1.body as Phaser.Physics.Arcade.Body;
            // console.log(body1.blocked);
            // }
        );
    }

    addSlimeAnimation() {
        const logicLayer = this.map.getObjectLayer("logic");
        const startPoint = logicLayer.objects.find(
            (item) => item.name === "start"
        );

        const startX = startPoint?.x || 0;
        const startY = startPoint?.y || 0;

        const components: ScriptComponent[] = [platformerInput];
        addAnimation(this, ANIMATIONS.slimeg);
        this.slime = new SlimegCharacterSprite(
            this,
            startX,
            startY,
            components
        );

        this.cameras.main.startFollow(this.slime);

        this.movingSprites = this.physics.add.group({
            // collideWorldBounds: true,
            dragX: 140,
        });
        this.movingSprites.add(this.slime);
    }

    addLevel() {
        this.map = this.add.tilemap("map");

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const tiles: Phaser.Tilemaps.Tileset = this.map.addTilesetImage(
            "levelProto",
            "tiles"
        );

        this.bottomLayer = this.map
            .createStaticLayer("bottom", tiles, 0, 0)
            .setDepth(-1);
        this.topLayer = this.map
            .createStaticLayer("main", tiles, 0, 0)
            .setDepth(-1);

        // this.bottomLayer.alpha = 0.5;
        // this.topLayer.alpha = 0.5;

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
    }
}
