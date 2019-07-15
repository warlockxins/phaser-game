import { CharacterSprite } from "./CharacterSprite";
import { StateMachine } from "../stateMachine/StateMachine";

export class SlimegCharacterSprite extends CharacterSprite {
    constructor(scene, x, y, scriptComponents) {
        const texture = "slimeg";
        const frame = "slime1.png";
        super(scene, x, y, texture, frame);

        scene.physics.world.enableBody(this);
        this.body.setMaxSpeed(140);
        this.body.setMaxSpeed(140);
        this.body.setDragX(140);

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
                this.anims.play("stand", true);
                this.body.setAllowDrag(true);
            },
            update: increase => {
                if (this.direction.left) {
                    this.body.velocity.x -= increase;
                } else if (this.direction.right) {
                    this.body.velocity.x += increase;
                }
            },
            exit: function() {}
        });

        sm.state("walking", {
            enter: () => {
                this.anims.play("walk", true);
                this.body.setAllowDrag(true);
            },
            update: increase => {
                if (this.direction.left) {
                    this.body.velocity.x -= increase;
                } else if (this.direction.right) {
                    this.body.velocity.x += increase;
                }

                this.flipX = this.body.velocity.x > 0;
            },
            exit: () => {}
        });

        sm.state("jumping", {
            enter: () => {
                this.setVelocity(this.body.velocity.x, -140);

                this.anims.stop();
                this.body.setAllowDrag(false);
            },
            update: delta => {
                const increase = 0.5 + delta;

                if (this.direction.left) {
                    this.body.velocity.x -= increase;
                } else if (this.direction.right) {
                    this.body.velocity.x += increase;
                }
            },
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
        sm.transition("walking_to_standing", "walking", "standing", () => {
            return (
                this.body.onFloor() &&
                Math.abs(this.body.velocity.x) < 2 &&
                new Date() - sm.timer > 200
            );
        });

        sm.transition("standing_to_walking", "standing", "walking", () => {
            return (
                this.body.onFloor() &&
                Math.abs(this.body.velocity.x) > 2 &&
                new Date() - sm.timer > 100
            );
        });

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

        sm.transition("walking_to_jumping", "walking", "jumping", jumpFunction);

        // landing
        sm.transition("jumping_to_standing", "jumping", "standing", () => {
            return (
                this.body.onFloor() &&
                new Date() - sm.timer > 1 &&
                Math.abs(this.body.velocity.x) < 2
            );
        });

        sm.transition("jumping_to_walking", "jumping", "walking", () => {
            return (
                this.body.onFloor() &&
                new Date() - sm.timer > 1 &&
                Math.abs(this.body.velocity.x) > 2
            );
        });

        this.stateMachine = sm;
    }

    preUpdate(time, delta) {
        super.preUpdate && super.preUpdate(time, delta);
        this.handleScriptComponents();
        this.stateMachine.update(delta);
    }
}
