import { StateMachine } from "../../stateMachine/StateMachine";
import { IStateMachineState } from "../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../SlimegCharacterSprite";
import { GroundedState } from './GroundedState';
import { AirbornState } from './AirbornState';

enum STATES {
    GROUNDED,
    AIRBORN
}

export class AliveState implements IStateMachineState {
    machine: StateMachine;

    constructor(slimeg: SlimegCharacterSprite) {
        this.machine = new StateMachine();

        this.machine.addState(
            STATES.GROUNDED,
            new GroundedState(slimeg)
        );

        this.machine.addState(
            STATES.AIRBORN,
            new AirbornState(slimeg)
        );

        // Transitions
        this.machine.addTransition(
            STATES.AIRBORN,
            STATES.GROUNDED,
            () => slimeg.isOnGround()
        );

        this.machine.addTransition(
            STATES.GROUNDED,
            STATES.AIRBORN,
            () => !slimeg.isOnGround()
        );
    }

    enter(): void {
    }

    update(deltaTime: number): void {
        this.machine.update(deltaTime);
    }

    exit(): void {}
}
