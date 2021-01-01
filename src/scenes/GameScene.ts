// https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-fire-being-kind-with-players-by-setting-its-body-smaller-than-the-image/

// animating tiles here
// https://medium.com/@junhongwang/tiled-generated-map-with-phaser-3-d2c16ffe75b6
import { CST } from "../constants/CST";
import { addAnimation, SlimegCharacterSprite } from "../Sprite";
import { ANIMATIONS } from "../animation";

import { ScriptComponent } from "../scriptComponent/scriptComponent";
import { platformerInput } from "../scriptComponent/platformerInput";
import { platformerInputBot } from "../scriptComponent/platformerInputBot";
import { AnimatedTileSceneBase } from "../levelComponents/AnimatedTileSceneBase";

export class GameScene extends AnimatedTileSceneBase {
    movingSprites!: Phaser.Physics.Arcade.Group;
    playerBulletGroup!: Phaser.Physics.Arcade.Group;

    slime?: SlimegCharacterSprite;

    instantKillLayer!: Phaser.Tilemaps.StaticTilemapLayer;

    constructor() {
        super({
            key: CST.SCENES.GAME,
        });
    }

    init(data) {
        console.log("data passed to this scene", data);
    }

    preload() {
    }

    create() {
        this.addGroups();
        this.addLevel();
        this.addPlayer();
        this.setupPhysics();
        this.setupDamageBlock();
        this.createAnimatedTiles();

        this.physics.world.setBounds(this.topLayer.displayOriginX,
            this.topLayer.displayOriginY,
            this.topLayer.displayWidth,
            this.topLayer.displayHeight
        );

        this.createCollectables();
    }

    createCollectables() {
        const tileTexture: Phaser.Textures.Texture = this.textures.list["tiles"];
        tileTexture.add('bugLowRight', 0, 60, 0, 30, 30);

        const coinId = 3;
        const idForEmpty = -1;

        const surpriseBox = this.map.createFromTiles(
            coinId, idForEmpty,
            {
                origin: {
                    x: 0,
                    y: 0
                },
                key: 'tiles',
                frame: 'bugLowRight',
            },
            this, undefined, this.topLayer
        );
    }

    addGroups() {
        this.playerBulletGroup = this.physics.add.group({ allowGravity: false });
        this.movingSprites = this.physics.add.group({
            collideWorldBounds: true,
            dragX: 140,
        });
    }

    setupDamageBlock() {
        const damageObject = this.getLogicObject('damage');
        damageObject &&
            this.addDeathZones(damageObject?.x, damageObject?.y, damageObject?.width, damageObject?.height);
    }

    setupPhysics() {
        this.topLayer.setCollisionByProperty({ collision: true });
        this.instantKillLayer.setCollisionByProperty({ instantKill: true });

        this.physics.add.collider(
            this.movingSprites,
            this.topLayer
        );

        // configure collision based on layer config
        this.physics.add.collider(
            this.movingSprites,
            this.instantKillLayer,
            (collider1, collider2) => {
                (<SlimegCharacterSprite>collider1).kill();
                this.movingSprites.remove(collider1);
            }
        );

        this.physics.add.collider(
            this.playerBulletGroup,
            this.topLayer,
            (bullet, c2) => {
                bullet.destroy();
            }
        );

    }

    getLogicObject(key: string) {
        return this.map.getObjectLayer("logic")
            .objects.find(
                (item) => item.name === key);
    }

    addPlayer() {
        const startPoint = this.getLogicObject('start');

        if (!startPoint) {
            return;
        }

        const components: ScriptComponent[] = [platformerInput];
        addAnimation(this, ANIMATIONS.slimeg);
        this.slime = new SlimegCharacterSprite(
            this,
            startPoint.x || 0,
            startPoint.y || 0,
            components
        );

        this.cameras.main.startFollow(this.slime, true, 0.1, 0.1);
        this.movingSprites.add(this.slime);
    }

    addDeathZones(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        const zone = this.add.zone(x, y, w, h);
        this.physics.world.enable(zone);
        zone.setOrigin(0, 0);
        (<Phaser.Physics.Arcade.Body>zone.body).setAllowGravity(false);
        (<Phaser.Physics.Arcade.Body>zone.body).moves = false;
        this.physics.add.overlap(this.movingSprites, zone, (zoneItem, groupItem) => {
            // groupItem.kill();
            // this.movingSprites.remove(groupItem);
            (<SlimegCharacterSprite>groupItem).addDamage(1);
        });
    }

    addLevel() {
        this.map = this.add.tilemap("map");

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        this.tileset = this.map.addTilesetImage(
            "levelProto",
            "tiles"
        );

        this.bottomLayer = this.map
            .createDynamicLayer("bottom", this.tileset, 0, 0)
            .setDepth(-1);

        this.topLayer = this.map
            .createDynamicLayer("main", this.tileset, 0, 0)
            .setDepth(-1);

        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(this.topLayer.layer.properties[0].value);

        this.instantKillLayer = this.map
            .createStaticLayer("instantDeath", this.tileset, 0, 0)
            .setDepth(-1);

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        //   this.cameras.main.setOrigin(0.1, 1);
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}
