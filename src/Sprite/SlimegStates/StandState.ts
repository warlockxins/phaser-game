import { IStateMachineState } from "../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../SlimegCharacterSprite";

export class StandState implements IStateMachineState {
    slimeg: SlimegCharacterSprite;
    constructor(slimeg: SlimegCharacterSprite) {
        this.slimeg = slimeg;
    }
    enter(): void {
        this.slimeg.sprite.anims.play("stand", true);
        this.slimeg.text.setText("standing");
    }
    update(deltaTime: number): void {
        this.slimeg.addWalkSpeed(deltaTime);
    }
    exit(): void {}
}
