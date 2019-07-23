import { CharacterSprite } from "./CharacterSprite";
import { StateMachine } from "../stateMachine/StateMachine";

export class SlimegCharacterSprite extends CharacterSprite {
    constructor(scene, x, y, scriptComponents) {
        const texture = "slimeg";
        const frame = "slime1.png";
        super(scene, x, y, texture, frame);

        scene.physics.world.enableBody(this);
        this.body.setMaxVelocity(140, 140);

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

        const addWalkSpeed = increase => {
            if (this.direction.left) {
                this.body.velocity.x -= increase;
                this.flipX = !this.body.velocity.x > 1;
            } else if (this.direction.right) {
                this.body.velocity.x += increase;
                this.flipX = this.body.velocity.x > 1;
            }
        };

        sm.state("standing", {
            enter: () => {
                this.anims.play("stand", true);
                this.body.setAllowDrag(true);
            },
            update: increase => {
                addWalkSpeed(increase);
            },
            exit: function() {}
        });

        sm.state("walking", {
            enter: () => {
                this.anims.play("walk", true);
                this.body.setAllowDrag(true);
            },
            update: increase => {
                addWalkSpeed(increase);
            },
            exit: () => {}
        });

        sm.state("jumping", {
            enter: () => {
                this.setVelocityY(-140);

                this.anims.stop();
                this.body.setAllowDrag(false);
            },
            update: delta => {
                addWalkSpeed(0.3 * delta);
            },
            exit: () => {}
        });

        sm.state("falling", {
            enter: () => {
                this.anims.play("stand", false);
            },
            update: delta => {
                addWalkSpeed(0.3 * delta);
            },
            exit: () => {}
        });

        // walkin left
        sm.transition("walking_to_standing", "walking", "standing", () => {
            return this.body.onFloor() && Math.abs(this.body.velocity.x) < 2;
        });

        sm.transition("standing_to_walking", "standing", "walking", () => {
            return this.body.onFloor() && Math.abs(this.body.velocity.x) > 2;
        });

        //Jump
        const jumpFunction = () => this.body.onFloor() && this.direction.up;

        sm.transition(
            "standing_to_jumping",
            "standing",
            "jumping",
            jumpFunction
        );

        sm.transition("walking_to_jumping", "walking", "jumping", jumpFunction);

        // falling
        sm.transition("jumping_to_falling", "jumping", "falling", () => {
            return this.body.velocity.y >= 0;
        });
        sm.transition("walking_to_falling", "walking", "falling", () => {
            return this.body.velocity.y > 0;
        });
        sm.transition("standing_to_falling", "standing", "falling", () => {
            return this.body.velocity.y > 0;
        });

        // landing
        sm.transition("falling_to_standing", "falling", "standing", () => {
            return this.body.onFloor() && Math.abs(this.body.velocity.x) < 2;
        });

        sm.transition("falling_to_walking", "falling", "walking", () => {
            return this.body.onFloor() && Math.abs(this.body.velocity.x) > 2;
        });

        this.stateMachine = sm;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.handleScriptComponents();
        this.stateMachine.update(delta);
    }
}
