import { StateMachine } from "../../stateMachine/StateMachine";
import { IStateMachineState } from "../../stateMachine/interfaces";
import { SlimegCharacterSprite } from "../SlimegCharacterSprite";
import { StandState } from './StandState';
import { WalkState } from './WalkState';

enum STATES {
    STAND,
    WALK
}

export class GroundedState implements IStateMachineState {
    machine: StateMachine;
    slimeg: SlimegCharacterSprite;

    constructor(slimeg: SlimegCharacterSprite) {
        this.machine = new StateMachine();
        this.slimeg = slimeg;

        this.machine.addState(
            STATES.STAND,
            new StandState(slimeg)
        );

        this.machine.addState(
            STATES.WALK,
            new WalkState(slimeg)
        );

        // Transitions
        this.machine.addTransition(
            STATES.WALK,
            STATES.STAND,
            slimeg.isOnGroundNotMoving.bind(slimeg)
        );

        this.machine.addTransition(
            STATES.STAND,
            STATES.WALK,
            slimeg.isOnGroundMoving.bind(slimeg)
        );
    }

    enter(): void {
        // reset machine previousState
        this.machine.previousState = -1;
    }

    update(deltaTime: number): void {
        this.machine.update(deltaTime);
        if (this.slimeg.direction.up) {
             this.slimeg.body.setVelocityY(-350);
        }
    }

    exit(): void {}
}
