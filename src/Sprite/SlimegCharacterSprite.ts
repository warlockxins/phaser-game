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
        this.setSize(20, 38);

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

    isOnGroundNotMoving(): boolean {
        return this.body.onFloor() && Math.abs(this.body.velocity.x) === 0;
    }

    isOnGroundMoving(): boolean {
        return this.body.onFloor() && Math.abs(this.body.velocity.x) > 0;
    }

    shouldJump(): boolean {
        return this.body.onFloor() && this.direction.up;
    }

    createStateMachine() {
        const sm = new StateMachine();
        sm.addState(SLIMEG_STATE.STAND, new StandState(this));
        sm.addState(SLIMEG_STATE.WALK, new WalkState(this));
        sm.addState(SLIMEG_STATE.JUMP, new JumpState(this));
        sm.addState(SLIMEG_STATE.FALL, new FallState(this));
        //-------TRANSITIONS-------
        sm.addTransition(
            SLIMEG_STATE.WALK,
            SLIMEG_STATE.STAND,
            this.isOnGroundNotMoving.bind(this)
        );
        sm.addTransition(
            SLIMEG_STATE.STAND,
            SLIMEG_STATE.WALK,
            this.isOnGroundMoving.bind(this)
        );
        //Jump
        sm.addTransition(
            SLIMEG_STATE.STAND,
            SLIMEG_STATE.JUMP,
            this.shouldJump.bind(this)
        );
        sm.addTransition(
            SLIMEG_STATE.WALK,
            SLIMEG_STATE.JUMP,
            this.shouldJump.bind(this)
        );
        // falling
        sm.addTransition(
            SLIMEG_STATE.JUMP,
            SLIMEG_STATE.FALL,
            () => this.body.velocity.y > 0
        );
        sm.addTransition(
            SLIMEG_STATE.WALK,
            SLIMEG_STATE.FALL,
            () => this.body.velocity.y > 0
        );
        sm.addTransition(
            SLIMEG_STATE.STAND,
            SLIMEG_STATE.FALL,
            () => this.body.velocity.y > 0
        );
        // landing
        sm.addTransition(
            SLIMEG_STATE.FALL,
            SLIMEG_STATE.STAND,
            this.isOnGroundNotMoving.bind(this)
        );
        sm.addTransition(
            SLIMEG_STATE.FALL,
            SLIMEG_STATE.WALK,
            this.isOnGroundMoving.bind(this)
        );
        this.stateMachine = sm;
    }

    preUpdate(time: number, delta: number) {
        this.handleScriptComponents();
        this.stateMachine.update(delta);
    }
}
