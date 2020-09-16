import { StateMachine } from "../../stateMachine/StateMachine";
import { SlimegCharacterSprite } from "../SlimegCharacterSprite";

import { StandState } from "./StandState";
import { WalkState } from "./WalkState";
import { JumpState } from "./JumpState";
import { FallState } from "./FallState";

enum GROUNDED_CHARACTER_STATE {
    STAND,
    WALK,
    JUMP,
    FALL,
}

export class SlimegStateMachine extends StateMachine {
    constructor(grounedCharacter: SlimegCharacterSprite) {
        super();

        this.addState(
            GROUNDED_CHARACTER_STATE.STAND,
            new StandState(grounedCharacter)
        );
        this.addState(
            GROUNDED_CHARACTER_STATE.WALK,
            new WalkState(grounedCharacter)
        );
        this.addState(
            GROUNDED_CHARACTER_STATE.JUMP,
            new JumpState(grounedCharacter)
        );
        this.addState(
            GROUNDED_CHARACTER_STATE.FALL,
            new FallState(grounedCharacter)
        );
        //-------TRANSITIONS-------
        this.addTransition(
            GROUNDED_CHARACTER_STATE.WALK,
            GROUNDED_CHARACTER_STATE.STAND,
            grounedCharacter.isOnGroundNotMoving.bind(grounedCharacter)
        );
        this.addTransition(
            GROUNDED_CHARACTER_STATE.STAND,
            GROUNDED_CHARACTER_STATE.WALK,
            grounedCharacter.isOnGroundMoving.bind(grounedCharacter)
        );
        //Jump
        this.addTransition(
            GROUNDED_CHARACTER_STATE.STAND,
            GROUNDED_CHARACTER_STATE.JUMP,
            grounedCharacter.shouldJump.bind(grounedCharacter)
        );
        this.addTransition(
            GROUNDED_CHARACTER_STATE.WALK,
            GROUNDED_CHARACTER_STATE.JUMP,
            grounedCharacter.shouldJump.bind(grounedCharacter)
        );
        // falling
        this.addTransition(
            GROUNDED_CHARACTER_STATE.JUMP,
            GROUNDED_CHARACTER_STATE.FALL,
            () => grounedCharacter.body.velocity.y > 0
        );
        this.addTransition(
            GROUNDED_CHARACTER_STATE.WALK,
            GROUNDED_CHARACTER_STATE.FALL,
            () => grounedCharacter.body.velocity.y > 0
        );
        this.addTransition(
            GROUNDED_CHARACTER_STATE.STAND,
            GROUNDED_CHARACTER_STATE.FALL,
            () => grounedCharacter.body.velocity.y > 0
        );
        // landing
        this.addTransition(
            GROUNDED_CHARACTER_STATE.FALL,
            GROUNDED_CHARACTER_STATE.STAND,
            grounedCharacter.isOnGroundNotMoving.bind(grounedCharacter)
        );
        this.addTransition(
            GROUNDED_CHARACTER_STATE.FALL,
            GROUNDED_CHARACTER_STATE.WALK,
            grounedCharacter.isOnGroundMoving.bind(grounedCharacter)
        );
    }
}
