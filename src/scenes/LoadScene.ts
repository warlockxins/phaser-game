import { CST } from "../constants/CST";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD,
        });
    }

    init() { }

    preload() {
        this.load.atlas("slimeg", "atlas/slimeg.png", "atlas/slimeg.json");
        this.load.image("tiles", "levels/level1/l1.png");

        this.load.tilemapTiledJSON("map", "levels/level1/l1.json");

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff,
            },
        });

        this.load.on("progress", (progress) => {
            loadingBar.fillRect(
                0,
                this.game.renderer.height / 2,
                this.game.renderer.width * progress,
                50
            );
        });
    }
    create() {
        setTimeout(() => {
            this.scene.start(CST.SCENES.MENU, { message: "from load scene" });
        }, 500);
    }
}
