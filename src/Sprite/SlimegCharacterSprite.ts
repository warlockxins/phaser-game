import { StateMachine } from "../stateMachine/StateMachine";
import { SlimegStateMachine } from "./SlimegStateMachine";

import { ScriptComponent } from "../scriptComponent/scriptComponent";

interface MoveDirection {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export class SlimegCharacterSprite extends Phaser.GameObjects.Container {
    direction: MoveDirection;
    scriptComponents: ScriptComponent[];
    body!: Phaser.Physics.Arcade.Body;
    stateMachine!: StateMachine;

    text!: Phaser.GameObjects.Text;

    sprite!: Phaser.GameObjects.Sprite;

    health = 100;
    // implement damage Controller 

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
        // this.scaleX = -1;

        this.sprite = scene.add.sprite(0, 0, "slimeg", "slime1.png");
        this.sprite.setScale(0.2);
        this.sprite.setOrigin(0.5);
        this.add(this.sprite);
        // this.sprite.play("stand", true);
        this.sprite.flipX = false;

        scene.physics.world.enableBody(this);
        this.body.setMaxVelocity(180, 240);

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

        this.stateMachine = new SlimegStateMachine(this);
        this.createText();
    }

    createText() {
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: "Arial",
            fontSize: "14px",
            color: "#ff0044",
            // wordWrap: true,
            // wordWrapWidth: this.width,
            align: "center",
            backgroundColor: "#ffff00",
            padding: { x: 5, y: 5 },
            // stroke: "#ff0000",
            // strokeThickness: 2,
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

    kill() {
        this.health = 0;
        //  console.log('should destroy')
    }

    addDamage(amount: number) {
        this.health -= amount;

        if (this.health > 0) {
            console.log('should live - temporarily immortal');
        }
    }

    addWalkSpeed(increase: number) {
        if (this.direction.left) {
            this.body.velocity.x -= increase;
            this.sprite.flipX = false;
        } else if (this.direction.right) {
            this.body.velocity.x += increase;
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

    preUpdate(time: number, delta: number) {
        this.handleScriptComponents();
        this.stateMachine.update(delta);
    }
}
