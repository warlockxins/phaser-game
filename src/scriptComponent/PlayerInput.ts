import { ControllableCharacter, ScriptComponent } from "~/Sprite/interfaces";

export class PlatformerInput implements ScriptComponent {
    keyboard;
    gameObject: ControllableCharacter;

    constructor(scene: Phaser.Scene, gameObject: ControllableCharacter) {
        this.gameObject = gameObject;
        this.keyboard = scene.input.keyboard.addKeys("W, A, S, D, Space");
    }
    update() {
        this.gameObject.direction.left = this.keyboard.A.isDown;
        this.gameObject.direction.right = this.keyboard.D.isDown;
        this.gameObject.direction.up = this.keyboard.W.isDown;

        this.gameObject.direction.fire = this.keyboard.Space.isDown;
    }
    destroy() { }
};
