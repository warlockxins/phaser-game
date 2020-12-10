import { StateMachine } from "../../../stateMachine/StateMachine";
import { IStateMachineState } from "../../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../../SlimegCharacterSprite";
import {JumpState} from './JumpState';
import {FallState} from './FallState';

enum STATES {
    JUMP,
    FALL
}

export class AirbornState implements IStateMachineState {
    machine: StateMachine;
    slimeg: SlimegCharacterSprite;

    constructor(slimeg: SlimegCharacterSprite) {
        this.machine = new StateMachine();
        this.slimeg = slimeg;

        this.machine.addState(
            STATES.JUMP,
            new JumpState(slimeg)
        );

        this.machine.addState(
            STATES.FALL,
            new FallState(slimeg)
        );

        // Transitions
        this.machine.addTransition(
            STATES.JUMP,
            STATES.FALL,
            () => slimeg.body.velocity.y > 0
        );

        this.machine.addTransition(
            STATES.FALL,
            STATES.JUMP,
            () => slimeg.body.velocity.y < 0
        );
    }

    enter(): void {
        // set previousState to non existent to trigger on start for new substate
        this.machine.previousState = -1;
        this.machine.currentState =  this.slimeg.body.velocity.y >= 0 ? STATES.FALL : STATES.JUMP;
    }

    update(deltaTime: number): void {
        this.machine.update(deltaTime);
    }

    exit(): void {
        this.machine.exitCurrentState();
    }
}
