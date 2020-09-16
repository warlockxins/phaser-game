import { IStateMachineState } from "../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../SlimegCharacterSprite";

export class WalkState implements IStateMachineState {
    slimeg: SlimegCharacterSprite;
    constructor(slimeg: SlimegCharacterSprite) {
        this.slimeg = slimeg;
    }
    enter(): void {
        this.slimeg.sprite.anims.play("walk", true);
        this.slimeg.text.setText("walking");
    }
    update(deltaTime: number): void {
        this.slimeg.addWalkSpeed(deltaTime);
    }
    exit(): void {}
}
