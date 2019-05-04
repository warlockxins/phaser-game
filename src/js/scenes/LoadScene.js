import { CST } from "../constants/CST";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        });
    }

    init() {}

    preload() {
        this.load.atlas(
            "slimeg",
            "assets/atlas/slimeg.png",
            "assets/atlas/slimeg.json"
        );
        this.load.image("tiles", "assets/levels/sewer_tileset.png");
        this.load.tilemapTiledJSON("map", "assets/levels/sewersObjects.json");

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
