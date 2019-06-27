// https://www.emanueleferonato.com/2019/01/23/html5-endless-runner-built-with-phaser-and-arcade-physics-step-5-adding-deadly-fire-being-kind-with-players-by-setting-its-body-smaller-than-the-image/
import { CST } from "../constants/CST";
import { CharacterSprite, addAnimation } from "../Sprite";
import { ANIMATIONS } from "../animation";

import { StateMachine } from "../stateMachine/StateMachine";

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }

    init(data) {
        console.log("data passed to this scene", data);
    }

    preload() {}
    create() {
        this.addLevel();
        this.addSlimeAnimation();
        this.setupControls();
        this.setupPhysics();
        this.createStateMachine();
    }

    update(time, delta) {
        this.stateMachine.update();
    }

    setupPhysics() {
        this.physics.add.collider(this.slime, this.topLayer);
        this.topLayer.setCollisionByProperty({ collision: true });
    }

    addSlimeAnimation() {
        addAnimation(this, ANIMATIONS.slimeg);
        this.slime = new CharacterSprite(this, 80, 200, "slimeg", "slime1.png");
        this.slime.setScale(0.5, 0.5);

        this.cameras.main.startFollow(this.slime);
    }
    setupControls() {
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        this.help = this.add.text(16, 16, "Press A or D to navigate", {
            fontSize: "18px",
            padding: { x: 10, y: 5 },
            backgroundColor: "#000000",
            fill: "#ffffff"
        });
        this.help.setScrollFactor(0);

        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
    }

    addLevel() {
        this.map = this.add.tilemap("map");

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const tiles = this.map.addTilesetImage("sewer_tileset", "tiles");

        this.bottomLayer = this.map
            .createStaticLayer("Bottom", [tiles], 0, 0)
            .setDepth(-1);
        this.topLayer = this.map
            .createStaticLayer("Top", [tiles], 0, 0)
            .setDepth(-1);
    }

    createStateMachine() {
        const sm = new StateMachine();
        sm.state("standing", {
            enter: () => {
                this.slime.setVelocityX(0);
                this.slime.anims.play("stand", true);
            },
            update: function() {},
            exit: function() {}
        });

        sm.state("walking_left", {
            enter: () => {
                this.slime.anims.play("walk", true);
                this.slime.flipX = false;
                this.slime.setVelocityX(-100);
            },
            update: () => {
            },
            exit: () => {
            }
        });

        sm.state("walking_right", {
            enter: () => {
                this.slime.anims.play("walk", true);
                this.slime.flipX = true;
                this.slime.setVelocityX(100);
            },
            update: () => {
            },
            exit: () => {
            }
        });

        sm.state("jumping", {
            enter: () => {
                this.slime.setVelocity(this.slime.body.velocity.x, -140);

                this.slime.anims.stop();
            },
            update: () => {
            },
            exit: () => {
            }
        });

        // walkin left
        sm.transition("walking_left_to_standing", "walking_left", "standing", () => {
            return this.slime.body.onFloor() && !this.keyboard.A.isDown && new Date() - sm.timer > 200;
        });

        sm.transition("standing_to_walking_left", "standing", "walking_left", () => {
            return this.slime.body.onFloor() && this.keyboard.A.isDown && new Date() - sm.timer > 100;
        });

        //waliking right
        sm.transition("walking_right_to_standing", "walking_right", "standing", () => {
            return this.slime.body.onFloor() && !this.keyboard.D.isDown && new Date() - sm.timer > 200;
        });

        sm.transition("standing_to_walking_right", "standing", "walking_right", () => {
            return this.slime.body.onFloor() && this.keyboard.D.isDown && new Date() - sm.timer > 100;
        });

        //Jump

        const jumpFunction = () => {
            return this.slime.body.onFloor() && this.keyboard.W.isDown && this.slime.body.velocity.y == 0;
        };

        sm.transition("standing_to_jumping", "standing", "jumping", jumpFunction);

        sm.transition("walking_right_to_jumping", "walking_right", "jumping", jumpFunction);

        sm.transition("walking_left_to_jumping", "walking_left", "jumping", jumpFunction);

        // landing
        sm.transition("jumping_to_standing", "jumping", "standing", () => {
            return this.slime.body.onFloor() && this.slime.body.velocity.y == 0 && !(this.keyboard.D.isDown || this.keyboard.A.isDown);
        });

        sm.transition("jumping_to_walking_right", "jumping", "walking_right", () => {
            return this.slime.body.onFloor()  && this.slime.body.velocity.y == 0
            && this.keyboard.D.isDown;
        });

        sm.transition("jumping_to_walking_left", "jumping", "walking_left", () => {
            return this.slime.body.onFloor()  && this.slime.body.velocity.y == 0
            && this.keyboard.A.isDown;
        });

        this.stateMachine = sm;
    }
}
