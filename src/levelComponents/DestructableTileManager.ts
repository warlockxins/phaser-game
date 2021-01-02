import { DestructableTile } from "./DestructableTile";

const DESTRUCTABLE_IDS = [
    3, // [?]
    7  // animated eye
]

const destructableId = 'destructableId';

const textureFrame = 'destrucrable Frame';
const textureFrame2 = 'destrucrable Frame2';

export class DestructableTileManager {
    private tiles: Map<string, DestructableTile> = new Map();
    private group: Phaser.GameObjects.Group;
    private scene: Phaser.Scene;

    constructor(tilemap: Phaser.Tilemaps.Tilemap, tileLayer: Phaser.Tilemaps.DynamicTilemapLayer, textureName: string, scene: Phaser.Scene) {
        this.scene = scene;

        const destructableTiles = tilemap.filterTiles((tile: Phaser.Tilemaps.Tile) => {
            return DESTRUCTABLE_IDS.includes(tile.index);
        }, undefined, undefined, undefined, undefined, undefined, { isNotEmpty: true }, tileLayer);

        destructableTiles.forEach((tile) => {
            this.add(tile);
        });

        const tileTexture: Phaser.Textures.Texture = scene.textures.list["tiles"];
        tileTexture.add(textureName, 0, 60, 0, 30, 30);
        tileTexture.add(textureFrame2, 0, 180, 0, 30, 30);

        this.group = scene.add.group({
            defaultKey: textureName,
            defaultFrame: textureFrame,
            maxSize: 10,
            createCallback: (block) => {
                block.setOrigin(0, 0);
                block.setDataEnabled();
                block.data.set('tweenIndex', this.group.getLength() - 1);
            },
            removeCallback: function (alien) {
                console.log('Removed', alien.name);
            }
        });
    }

    tileKey(tile: Phaser.Tilemaps.Tile): string {
        return `${tile.x}_${tile.y}`;
    }

    add(tile: Phaser.Tilemaps.Tile) {
        this.tiles.set(this.tileKey(tile),
            new DestructableTile(
                tile
            ));
    }

    trigger(tile: Phaser.Tilemaps.Tile): boolean {
        const id = this.tileKey(tile);
        const destructable = this.tiles.get(id);

        if (!destructable) {
            return false;
        }

        if (destructable.tweenIndex !== -1 || destructable.lives <= 0) {
            return false;
        }

        // now block logic
        destructable.hit(1);
        if (destructable.lives <= 0) {
            console.log('show sparks');
            this.tiles.delete(id);
            return true;
        }
        //

        const sprite = this.group.get(tile.pixelX, tile.pixelY);
        if (!sprite) {
            return false;
        }

        tile.setVisible(false);

        // const cropRec: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(tile.index * tile.width, 0, tile.width, tile.height);
        // debugger;
        const sp = sprite
            .setActive(true)
            .setVisible(true)
            .setTint(Phaser.Display.Color.RandomRGB().color)
            .setFrame(textureFrame2)


        this.scene.tweens.add({
            targets: sprite,
            y: '-=5',
            duration: 200,
            ease: 'Power3',
            paused: true,
            yoyo: true,
            onComplete: (_tweenGone: Phaser.Tweens.Tween, blockItem) => {
                tile.setVisible(true);
                const item = blockItem[0];
                const destructableObjectId = item.data.get(destructableId);
                const desroyedObject = this.tiles.get(destructableObjectId);
                if (desroyedObject) {
                    desroyedObject.tweenIndex = -1;
                }
                this.group.killAndHide(item);
                this.scene.tweens.remove(_tweenGone);
            }
        }).play();

        const spriteIndex = sprite.data.get('tweenIndex');
        sprite.data.set(destructableId, id);
        destructable.tweenIndex = spriteIndex;

        return false;
    }
}