import { CharacterSprite } from "./CharacterSprite";
import { StateMachine } from "../stateMachine/StateMachine";
import { ScriptComponent } from "../scriptComponent/scriptComponent";

interface MoveDirection {
    left: boolean;
    right: boolean;
    up: boolean;
}

export class SlimegCharacterSprite extends CharacterSprite {
    direction: MoveDirection;
    scriptComponents: ScriptComponent[];
    body!: Phaser.Physics.Arcade.Body;
    stateMachine!: StateMachine;

    text!: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x,
        y,
        scriptComponents: ScriptComponent[]
    ) {
        super(scene, x, y, "slimeg", "slime1.png");

        scene.physics.world.enableBody(this);
        const body: Phaser.Physics.Arcade.Body = this.body;
        body.setMaxVelocity(140, 140);
        this.setOrigin(0.5);

        this.direction = {
            left: false,
            right: false,
            up: false,
        };

        this.scriptComponents = scriptComponents;

        this.scriptComponents.forEach((component) => {
            component.start(scene, this);
        });

        this.createStateMachine();
        this.createText();
    }

    updateText() {
        this.text.x = this.x;
        this.text.y = Math.floor(this.y - this.displayHeight);
    }
    createText() {
        const style = {
            font: "14px Arial",
            fill: "#ff0044",
            wordWrap: true,
            wordWrapWidth: this.width,
            align: "center",
            backgroundColor: "#ffff00",
        };

        this.text = this.scene.add.text(
            0,
            0,
            "- text on a sprite -\ndrag me",
            style
        );
        this.text.setOrigin(0.5);
    }

    handleScriptComponents() {
        this.scriptComponents.forEach((component) => {
            component.update(this);
        });
    }

    addWalkSpeed(increase) {
        if (this.direction.left) {
            this.body.velocity.x -= increase;
            this.flipX = false;
        } else if (this.direction.right) {
            this.body.velocity.x += increase;
            this.flipX = true;
        }
    }

    createStateMachine() {
        const sm = new StateMachine();

        sm.state("standing", {
            enter: () => {
                this.anims.play("stand", true);
                this.body.setAllowDrag(true);
                this.text.setText("standing");
            },
            update: (increase) => {
                this.addWalkSpeed(increase);
            },
            exit: function () {},
        });

        sm.state("walking", {
            enter: () => {
                this.anims.play("walk", true);
                this.text.setText("walking");
                // this.body.setAllowDrag(true);
            },
            update: (increase) => {
                this.addWalkSpeed(increase);
            },
            exit: () => {},
        });

        sm.state("jumping", {
            enter: () => {
                this.setVelocityY(-140);

                this.anims.stop();
                this.text.setText("jumping");
                // this.body.setAllowDrag(false);
            },
            update: (delta) => {
                this.addWalkSpeed(0.3 * delta);
            },
            exit: () => {},
        });

        sm.state("falling", {
            enter: () => {
                this.anims.play("stand", false);
                this.text.setText("falling");
            },
            update: (delta) => {
                this.addWalkSpeed(0.3 * delta);
            },
            exit: () => {},
        });

        // walkin left
        sm.transition("walking_to_standing", "walking", "standing", () => {
            return this.body.onFloor() && Math.abs(this.body.velocity.x) === 0;
        });

        sm.transition("standing_to_walking", "standing", "walking", () => {
            return this.body.onFloor() && Math.abs(this.body.velocity.x) > 0;
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
            return this.body.velocity.y > 0;
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
        this.updateText();
    }
}
