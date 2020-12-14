// https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-fire-being-kind-with-players-by-setting-its-body-smaller-than-the-image/

// animating tiles here
// https://medium.com/@junhongwang/tiled-generated-map-with-phaser-3-d2c16ffe75b6
import { CST } from "../constants/CST";
import { addAnimation, SlimegCharacterSprite } from "../Sprite";
import { ANIMATIONS } from "../animation";

import { ScriptComponent } from "../scriptComponent/scriptComponent";
import { platformerInput } from "../scriptComponent/platformerInput";
import { platformerInputBot } from "../scriptComponent/platformerInputBot";
import { AnimatedTile } from '../levelComponents/AnimatedTile';

export class GameScene extends Phaser.Scene {
    map!: Phaser.Tilemaps.Tilemap;
    topLayer!: Phaser.Tilemaps.StaticTilemapLayer;
    bottomLayer!: Phaser.Tilemaps.StaticTilemapLayer;
    movingSprites!: Phaser.Physics.Arcade.Group;

    playerBulletGroup: Phaser.Physics.Arcade.Group;

    slime?: SlimegCharacterSprite;
    
    private animatedTiles: AnimatedTile[];

    constructor() {
        super({
            key: CST.SCENES.GAME,
        });
    }

    init(data) {
        console.log("data passed to this scene", data);
        this.animatedTiles = [];
    }

    preload() {}
    
    create() {
        this.addLevel();
        this.addSlimeAnimation();
        this.setupPhysics();
        this.setupCollectables(); 
    }

    setupCollectables() {
        const logicLayer = this.map.getObjectLayer("logic");
        const damageObject = logicLayer.objects.find(
            (item) => item.name === "damage"
        );
        
        this.addDeathZones(damageObject?.x, damageObject.y, damageObject?.width, damageObject?.height);
    }

    setupPhysics() {
        this.topLayer.setCollisionByProperty({ collision: true });
        this.instantKillLayer.setCollisionByProperty({ instantKill: true});
        
        this.physics.add.collider(
            this.movingSprites,
            this.topLayer
        );
        
        // configure collision based on layer config
        this.physics.add.collider(
            this.movingSprites,
            this.instantKillLayer,
             (collider1, collider2) => {
                 collider1.kill();
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

        this.cameras.main.startFollow(this.slime, true, 0.1, 0.1);

        this.movingSprites = this.physics.add.group({
            // collideWorldBounds: true,
            dragX: 140,
        });
        this.movingSprites.add(this.slime); 

        this.playerBulletGroup = this.physics.add.group({ allowGravity: false });
    }

    addDeathZones(x, y, w, h) {
        const zone = this.add.zone(x, y).setSize(w, h);
        this.physics.world.enable(zone);
        zone.setOrigin(0, 0);
        zone.body.setAllowGravity(false);
        zone.body.moves = false;
        this.physics.add.overlap(this.movingSprites, zone, (zoneItem, groupItem: SlimegCharacterSprite) => {
            // groupItem.kill();
            // this.movingSprites.remove(groupItem);
            groupItem.addDamage(1);
        });
    }

    addLevel() {
        this.map = this.add.tilemap("map");

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const tiles: Phaser.Tilemaps.Tileset = this.map.addTilesetImage(
            "levelProto",
            "tiles"
        );
        this.tileset = tiles;

        this.bottomLayer = this.map
            .createDynamicLayer("bottom", tiles, 0, 0)
            .setDepth(-1);
        
        this.topLayer = this.map
            .createDynamicLayer("main", tiles, 0, 0)
            .setDepth(-1);
        
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(this.topLayer.layer.properties[0].value);

        this.instantKillLayer = this.map
            .createStaticLayer("instantDeath", tiles, 0, 0)
            .setDepth(-1);

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        //   this.cameras.main.setOrigin(0.1, 1);
        
        this.createAnimatedTiles();
    }

    createAnimatedTiles() {
        const tileset = this.tileset;       
        const tileData = tileset.tileData as TilesetTileData;

          for (let tileid in tileData) {
            this.map.layers.forEach(layer => {
                if (layer.tilemapLayer.type === "StaticTilemapLayer") {
                    console.log('ignoring', layer.name);
                    return;
                }
              layer.data.forEach(tileRow => {
                tileRow.forEach(tile => {
                  if (tile.index - tileset.firstgid === parseInt(tileid, 10)) {
                    this.animatedTiles.push(
                      new AnimatedTile(
                        tile,
                        tileData[tileid].animation,
                        tileset.firstgid
                      )
                    );
                  }
                });
              });
            });
          };
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.animatedTiles.forEach(tile => tile.update(delta));
    }
}
