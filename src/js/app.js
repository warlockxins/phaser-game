require("./app_t");
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    // this.load.setBaseURL("http://labs.phaser.io");

    // this.load.image("sky", "assets/skies/space3.png");
    // this.load.image("logo", "assets/sprites/phaser3-logo.png");
    // this.load.image("red", "assets/particles/red.png");

    this.load.atlas(
        "atlas",
        "assets/texturepacker_test.png",
        "assets/texturepacker_test.json"
    );
}

function create() {
    // this.add.image(400, 300, "sky");

    // var particles = this.add.particles("red");

    // var emitter = particles.createEmitter({
    //     speed: 10,
    //     scale: { start: 1, end: 0 },
    //     blendMode: "ADD"
    // });

    // var logo = this.physics.add.image(400, 100, "logo");

    // logo.setVelocity(10, 300);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);

    const chick = this.add.sprite(64, 64, "atlas", "budbrain_chick.png");

    const cop = this.add.sprite(600, 64, "atlas", "ladycop.png");

    const robot = this.add.sprite(50, 300, "atlas", "robot.png");

    const car = this.add.sprite(100, 400, "atlas", "supercars_parsec.png");

    const mech = this.add.sprite(250, 100, "atlas", "titan_mech.png");
}
