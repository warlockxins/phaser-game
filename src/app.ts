// for map data will try to use
//labs.phaser.io/edit.html?src=src/game%20objects\tilemap\static\tiled-json-map.js
// https://labs.phaser.io/edit.html?src=src%5Cgame%20objects%5Ctilemap%5Cstatic%5Ctileset%20collision%20shapes.js
// import Phaser from "phaser/src/phaser.js";

import Phaser from "phaser";

import { LoadScene } from "./scenes/LoadScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";

 const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    render: {
        antialiasGL: false,
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true,
        },
    },
    scene: [LoadScene, MenuScene, GameScene],
};

new Phaser.Game(config);
