import { CharacterSprite } from "./CharacterSprite";
import { StateMachine } from "../stateMachine/StateMachine";

export class SlimegCharacterSprite extends CharacterSprite {
    constructor(scene, x, y, keyboard) {
        const texture = "slimeg";
        const frame = "slime1.png";
        super(scene, x, y, texture, frame);

        this.keyboard = keyboard;
        this.createStateMachine();
    }

    createStateMachine() {
        const sm = new StateMachine();

        sm.state("standing", {
            enter: () => {
                this.setVelocityX(0);
                this.anims.play("stand", true);
            },
            update: function() {},
            exit: function() {}
        });

        sm.state("walking_left", {
            enter: () => {
                this.anims.play("walk", true);
                this.flipX = false;
                this.setVelocityX(-100);
            },
            update: () => {},
            exit: () => {}
        });

        sm.state("walking_right", {
            enter: () => {
                this.anims.play("walk", true);
                this.flipX = true;
                this.setVelocityX(100);
            },
            update: () => {},
            exit: () => {}
        });

        sm.state("jumping", {
            enter: () => {
                this.setVelocity(this.body.velocity.x, -140);

                this.anims.stop();
            },
            update: () => {},
            exit: () => {}
        });

        // walkin left
        sm.transition(
            "walking_left_to_standing",
            "walking_left",
            "standing",
            () => {
                return (
                    this.body.onFloor() &&
                    !this.keyboard.A.isDown &&
                    new Date() - sm.timer > 200
                );
            }
        );

        sm.transition(
            "standing_to_walking_left",
            "standing",
            "walking_left",
            () => {
                return (
                    this.body.onFloor() &&
                    this.keyboard.A.isDown &&
                    new Date() - sm.timer > 100
                );
            }
        );

        //waliking right
        sm.transition(
            "walking_right_to_standing",
            "walking_right",
            "standing",
            () => {
                return (
                    this.body.onFloor() &&
                    !this.keyboard.D.isDown &&
                    new Date() - sm.timer > 200
                );
            }
        );

        sm.transition(
            "standing_to_walking_right",
            "standing",
            "walking_right",
            () => {
                return (
                    this.body.onFloor() &&
                    this.keyboard.D.isDown &&
                    new Date() - sm.timer > 100
                );
            }
        );

        //Jump

        const jumpFunction = () => {
            return (
                this.body.onFloor() &&
                this.keyboard.W.isDown &&
                this.body.velocity.y == 0
            );
        };

        sm.transition(
            "standing_to_jumping",
            "standing",
            "jumping",
            jumpFunction
        );

        sm.transition(
            "walking_right_to_jumping",
            "walking_right",
            "jumping",
            jumpFunction
        );

        sm.transition(
            "walking_left_to_jumping",
            "walking_left",
            "jumping",
            jumpFunction
        );

        // landing
        sm.transition("jumping_to_standing", "jumping", "standing", () => {
            return (
                this.body.onFloor() &&
                this.body.velocity.y == 0 &&
                !(this.keyboard.D.isDown || this.keyboard.A.isDown)
            );
        });

        sm.transition(
            "jumping_to_walking_right",
            "jumping",
            "walking_right",
            () => {
                return (
                    this.body.onFloor() &&
                    this.body.velocity.y == 0 &&
                    this.keyboard.D.isDown
                );
            }
        );

        sm.transition(
            "jumping_to_walking_left",
            "jumping",
            "walking_left",
            () => {
                return (
                    this.body.onFloor() &&
                    this.body.velocity.y == 0 &&
                    this.keyboard.A.isDown
                );
            }
        );

        this.stateMachine = sm;
    }

    preUpdate(time, delta) {
        super.preUpdate && super.preUpdate(time, delta);
        this.stateMachine.update();
    }
}
