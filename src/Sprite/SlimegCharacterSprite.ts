import { StateMachine } from "../stateMachine/StateMachine";
import { ScriptComponent } from "../scriptComponent/scriptComponent";
import { StandState } from "./SlimegStates/StandState";
import { WalkState } from "./SlimegStates/WalkState";
import { JumpState } from "./SlimegStates/JumpState";
import { FallState } from "./SlimegStates/FallState";

interface MoveDirection {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

enum SLIMEG_STATE {
    STAND,
    WALK,
    JUMP,
    FALL,
}

// interface SlimegContext {
//     onGround: boolean;
//     xSpeed: number;
// }

export class SlimegCharacterSprite extends Phaser.GameObjects.Container {
    direction: MoveDirection;
    scriptComponents: ScriptComponent[];
    body!: Phaser.Physics.Arcade.Body;
    stateMachine!: StateMachine;

    text!: Phaser.GameObjects.Text;

    sprite!: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        scriptComponents: ScriptComponent[]
    ) {
        super(scene, x, y);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.setSize(45, 38);

        this.sprite = scene.add.sprite(0, 0, "slimeg", "slime1.png");
        this.sprite.setScale(0.2);
        this.sprite.setOrigin(0.5);
        this.add(this.sprite);
        this.sprite.play("stand", true);
        this.sprite.flipX = false;

        scene.physics.world.enableBody(this);
        this.body.setMaxVelocity(140, 140);

        this.direction = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        this.scriptComponents = scriptComponents;

        this.scriptComponents.forEach((component) => {
            component.start(scene, this);
        });

        this.createStateMachine();
        this.createText();
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
            -40,
            "- text on a sprite -\ndrag me",
            style
        );
        this.text.setOrigin(0.5);
        this.add(this.text);
    }

    handleScriptComponents() {
        this.scriptComponents.forEach((component) => {
            component.update(this);
        });
    }

    addWalkSpeed(increase: number) {
        if (this.direction.left) {
            this.body.velocity.x -= increase;
            // this.body.setAccelerationX(-100);
            this.sprite.flipX = false;
        } else if (this.direction.right) {
            this.body.velocity.x += increase;
            // this.body.setAccelerationX(100);
            this.sprite.flipX = true;
        }
    }

    createStateMachine() {
        const sm = new StateMachine();
        sm.state(SLIMEG_STATE.STAND, new StandState(this));
        sm.state(SLIMEG_STATE.WALK, new WalkState(this));
        sm.state(SLIMEG_STATE.JUMP, new JumpState(this));
        sm.state(SLIMEG_STATE.FALL, new FallState(this));
        //-------TRANSITIONS-------
        sm.transition(
            "walking_to_standing",
            SLIMEG_STATE.WALK,
            SLIMEG_STATE.STAND,
            () => {
                return (
                    this.body.onFloor() && Math.abs(this.body.velocity.x) === 0
                );
            }
        );
        sm.transition(
            "standing_to_walking",
            SLIMEG_STATE.STAND,
            SLIMEG_STATE.WALK,
            () => {
                return (
                    this.body.onFloor() && Math.abs(this.body.velocity.x) > 0
                );
            }
        );
        //Jump
        const jumpFunction = () => this.body.onFloor() && this.direction.up;
        sm.transition(
            "standing_to_jumping",
            SLIMEG_STATE.STAND,
            SLIMEG_STATE.JUMP,
            jumpFunction
        );
        sm.transition(
            "walking_to_jumping",
            SLIMEG_STATE.WALK,
            SLIMEG_STATE.JUMP,
            jumpFunction
        );
        // falling
        sm.transition(
            "jumping_to_falling",
            SLIMEG_STATE.JUMP,
            SLIMEG_STATE.FALL,
            () => {
                return this.body.velocity.y > 0;
            }
        );
        sm.transition(
            "walking_to_falling",
            SLIMEG_STATE.WALK,
            SLIMEG_STATE.FALL,
            () => {
                return this.body.velocity.y > 0;
            }
        );
        sm.transition(
            "standing_to_falling",
            SLIMEG_STATE.STAND,
            SLIMEG_STATE.FALL,
            () => {
                return this.body.velocity.y > 0;
            }
        );
        // landing
        sm.transition(
            "falling_to_standing",
            SLIMEG_STATE.FALL,
            SLIMEG_STATE.STAND,
            () => {
                return (
                    this.body.onFloor() && Math.abs(this.body.velocity.x) < 2
                );
            }
        );
        sm.transition(
            "falling_to_walking",
            SLIMEG_STATE.FALL,
            SLIMEG_STATE.WALK,
            () => {
                return (
                    this.body.onFloor() && Math.abs(this.body.velocity.x) > 2
                );
            }
        );
        this.stateMachine = sm;
    }

    // update(time, delta) {
    preUpdate(time: number, delta: number) {
        this.handleScriptComponents();
        this.stateMachine.update(delta);
        // debugger;
    }
}
