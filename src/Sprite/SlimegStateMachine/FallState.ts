import { IStateMachineState } from "../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../SlimegCharacterSprite";

export class FallState implements IStateMachineState {
    slimeg: SlimegCharacterSprite;
    constructor(slimeg: SlimegCharacterSprite) {
        this.slimeg = slimeg;
    }
    enter(): void {
        this.slimeg.sprite.anims.play("stand", false);
        this.slimeg.text.setText("falling");
    }
    update(deltaTime: number): void {
        this.slimeg.addWalkSpeed(0.3 * deltaTime);
    }
    exit(): void {}
}
