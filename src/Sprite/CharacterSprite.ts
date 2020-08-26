export class CharacterSprite
    // extends Phaser.GameObjects.Container
    extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | number | undefined
    ) {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.setOrigin(0, 0);

        // scene.add.container; Probably will be better to have common base container
        // https://labs.phaser.io/edit.html?src=src/game%20objects/container/matter%20physics%20body%20test.js&v=3.24.1
        // https://phaser.io/examples/v3/view/game-objects/tilemap/collision/matter-detect-collision-with-tile#
    }
}
