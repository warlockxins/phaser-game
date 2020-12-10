export class Bullet extends Phaser.GameObjects.Container {
    xDir: number;

    constructor (scene: Phaser.Scene, x: number, y: number, xDir: number) {
        super(scene, x, y);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.xDir = xDir;
        const bullet = scene.add.graphics({ fillStyle: { color: 0x00ff00 } });
        const circle = new Phaser.Geom.Circle(0, 0, 5);
        bullet.fillCircleShape(circle);

        this.setDepth(10);

        setTimeout(() => {
            this.destroy();
            //this.bullet = null;
        }, 1000);
        this.add(bullet);
    }

     preUpdate(time: number, delta: number) {
        this.x += delta * 0.5 * this.xDir;
    }
}

