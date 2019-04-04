import { CST } from "../CST";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        });
    }

    init() {}

    preload() {
        this.load.atlas("slimeg", "assets/slimeg.png", "assets/slimeg.json");
        this.load.image("tiles", "assets/sewer_tileset.png");
        // this.load.tilemapTiledJSON("map", "assets/sewers.json");
        this.load.tilemapTiledJSON("map", "assets/sewersObjects.json");

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on("progress", progress => {
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
            this.scene.start(CST.SCENES.MENU, "from load scene");
        }, 500);
    }
}
