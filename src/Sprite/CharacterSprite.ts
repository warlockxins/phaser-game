export class CharacterSprite
    // Phaser.GameObjects.Container
    extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.setOrigin(0, 0);
        // scene.add.container;
    }
}
