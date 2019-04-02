// for map data will try to use
//labs.phaser.io/edit.html?src=src/game%20objects\tilemap\static\tiled-json-map.js
// https://labs.phaser.io/edit.html?src=src%5Cgame%20objects%5Ctilemap%5Cstatic%5Ctileset%20collision%20shapes.js

import { LoadScene } from "./scenes/LoadScene";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [LoadScene, MenuScene, GameScene]
};

new Phaser.Game(config);
