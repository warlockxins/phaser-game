import { IStateMachineState } from "../../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../../SlimegCharacterSprite";

export class FallState implements IStateMachineState {
    slimeg: SlimegCharacterSprite;
    fallDeath: boolean = false;
    timer: number | undefined;

    constructor(slimeg: SlimegCharacterSprite) {
        this.slimeg = slimeg;
    }
    enter(): void {
        this.slimeg.sprite.anims.play("stand", false);
        this.slimeg.text.setText("falling");

        this.fallDeath = false;

        this.timer = setTimeout(() => {
            this.fallDeath = true;
            this.timer = undefined;
        }, 2000);

    }
    update(deltaTime: number): void {
        this.slimeg.addWalkSpeed(0.3 * deltaTime);
    }
    exit(): void {
        if (this.fallDeath === true) {
            this.slimeg.addDamage(1);
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = undefined;
    }
}
