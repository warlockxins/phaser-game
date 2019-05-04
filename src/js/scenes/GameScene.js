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
        if (this.keyboard.D.isDown === true) {
            this.slime.setVelocityX(100);
            this.slime.flipX = true;
            this.slime.anims.play("walk", true);
        }
        if (this.keyboard.A.isDown === true) {
            this.slime.setVelocityX(-100);
            this.slime.flipX = false;
            this.slime.anims.play("walk", true);
        }
        if (this.keyboard.W.isDown === true) {
            this.slime.setVelocityY(-140);
            this.slime.anims.stop();
        }

        if (!this.keyboard.A.isDown && !this.keyboard.D.isDown) {
            this.slime.setVelocityX(0);
            this.slime.anims.play("stand", true);
        }

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
                this.help.setText("standing");
            },
            update: function() {},
            exit: function() {}
        });

        sm.state("walking", {
            enter: () => {
                this.help.setText("walking");
            },
            update: function() {},
            exit: function() {}
        });

        // walkin
        sm.transition("walking_to_standing", "walking", "standing", () => {
            return !this.keyboard.A.isDown && new Date() - sm.timer > 1000;
        });

        sm.transition("standing_to_walking", "standing", "walking", () => {
            return this.keyboard.A.isDown && new Date() - sm.timer > 1000;
        });

        this.stateMachine = sm;
    }
}
