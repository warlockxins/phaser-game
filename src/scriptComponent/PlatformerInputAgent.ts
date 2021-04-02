import { ControllableCharacter, ScriptComponent } from "~/Sprite/interfaces";
import { PathPlanner } from '../levelComponents/PathPlanner';

const resetInterval = 500;
export class PlatformerInputAgent implements ScriptComponent {
    directionRight = true;
    gameObject: ControllableCharacter & Phaser.GameObjects.GameObject;
    scene: Phaser.Scene;

    resetTimer = 0;

    targetObject?: Phaser.GameObjects.GameObject;

    currentSelectedPath: { x: number, y: number }[] = [];

    lastKnownPathLength = 0;

    constructor(_scene: Phaser.Scene, gameObject: ControllableCharacter & Phaser.GameObjects.GameObject) {
        this.gameObject = gameObject;
        this.scene = _scene;
        // gameObject.direction.right = this.directionRight;
    }

    setTarget(targetObject?: Phaser.GameObjects.GameObject) {
        this.targetObject = targetObject;
    }

    calculatePathToTarget() {
        // console.log('----find path');
        if (!this.targetObject) {
            return;
        }

        const from = this.gameObject.body.position;
        const to = this.targetObject.body.position;
        const dist = this.calculateDistance(from, to);
        if (dist < 40) return;

        // hack
        from.y += 60;
        const fromPosition = vectorToNavMeshNodeKey(from, 30, 30);

        // hack
        to.y += 60;
        const toPosition = vectorToNavMeshNodeKey(to, 30, 30);


        const { vertices, edges } = this.scene.navMesh.mesh;
        const planner = new PathPlanner(vertices, edges); //new PathPlanner(vertices, edges);

        const result = planner.execute(fromPosition, toPosition);
        this.currentSelectedPath = result;
    }

    calculateDistance(fromNode, toNode) {
        return Math.sqrt(Math.pow((fromNode.x - toNode.x), 2) + Math.pow((fromNode.y - toNode.y), 2));
    }

    update(delta: number) {
        // if ((<Phaser.Physics.Arcade.Body>this.gameObject.body).onWall()) {
        // this.directionRight = !this.directionRight;
        // this.gameObject.direction.right = this.directionRight;
        // this.gameObject.direction.left = !this.directionRight;
        // }

        this.resetTimer += delta;
        if (this.resetTimer > resetInterval) {
            this.resetTimer = 0;
            this.calculatePathToTarget();
        }

        if (this.currentSelectedPath.length === 0) {
            this.gameObject.direction.up = false;
            this.gameObject.body.velocity.x = 0;
            return;
        }
        const nextPathPoint = this.currentSelectedPath[0];

        this.gameObject.direction.right = this.gameObject.body.position.x < nextPathPoint.x;
        this.gameObject.direction.left = this.gameObject.body.position.x > nextPathPoint.x;

        this.gameObject.direction.up = Math.abs(this.gameObject.body.position.y - nextPathPoint.y) > 40;

        if (Math.abs(this.gameObject.body.position.x - nextPathPoint.x) < 30) {
            this.currentSelectedPath.shift()
        }
    }
    destroy() { }
};

function vectorToNavMeshNodeKey(v: { x: number, y: number }, tileWidth: number, tileHeight: number) {
    const x = Math.floor(v.x / tileWidth) * tileWidth;
    const y = Math.floor(v.y / tileHeight) * tileHeight;
    return `${x}:${y}`;
}