import { ControllableCharacter, ScriptComponent } from "~/Sprite/interfaces";

export class PlatformerInputAgent implements ScriptComponent {
    directionRight = true;
    gameObject: ControllableCharacter & Phaser.GameObjects.GameObject;
    scene: Phaser.Scene;

    constructor(_scene: Phaser.Scene, gameObject: ControllableCharacter & Phaser.GameObjects.GameObject) {
        this.gameObject = gameObject;
        this.scene = _scene;
        gameObject.direction.right = this.directionRight;
    }

    update() {
        if ((<Phaser.Physics.Arcade.Body>this.gameObject.body).onWall()) {
            this.directionRight = !this.directionRight;
            this.gameObject.direction.right = this.directionRight;
            this.gameObject.direction.left = !this.directionRight;
        }
    }
    destroy() { }
};
