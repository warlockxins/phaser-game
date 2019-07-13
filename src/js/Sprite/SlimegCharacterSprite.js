import { CharacterSprite } from "./CharacterSprite";
import { StateMachine } from "../stateMachine/StateMachine";

export class SlimegCharacterSprite extends CharacterSprite {
    constructor(scene, x, y, scriptComponents) {
        const texture = "slimeg";
        const frame = "slime1.png";
        super(scene, x, y, texture, frame);

        scene.physics.world.enableBody(this);

        this.direction = {
            left: false,
            right: false,
            up: false
        };

        this.scriptComponents = scriptComponents;

        this.scriptComponents.forEach(component => {
            component.start(scene, this);
        });
        this.createStateMachine();
    }

    handleScriptComponents() {
        this.scriptComponents.forEach(component => {
            component.update(this);
        });
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

        sm.state("falling", {
            enter: () => {
                //temp
                this.anims.play("stand", true);
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
                    !this.direction.left &&
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
                    this.direction.left &&
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
                    !this.direction.right &&
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
                    this.direction.right &&
                    new Date() - sm.timer > 100
                );
            }
        );

        //Jump

        const jumpFunction = () => {
            return this.body.onFloor() && this.direction.up;
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
                new Date() - sm.timer > 1 &&
                !(this.direction.right || this.direction.left)
            );
        });

        sm.transition(
            "jumping_to_walking_right",
            "jumping",
            "walking_right",
            () => {
                return (
                    this.body.onFloor() &&
                    new Date() - sm.timer > 1 &&
                    this.direction.right
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
                    new Date() - sm.timer > 1 &&
                    this.direction.left
                );
            }
        );

        this.stateMachine = sm;
    }

    preUpdate(time, delta) {
        super.preUpdate && super.preUpdate(time, delta);
        this.handleScriptComponents();
        this.stateMachine.update();
    }
}
