import { ControllableCharacter, ScriptComponent } from "~/Sprite/interfaces";
import { PathPlanner } from '../levelComponents/PathPlanner';

const resetInterval = 200;

type Point = {
    x: number, y: number
}

enum NavigationState {
    FOUND,
    NOT_FOUND,
    ARRIVED
}

export class PlatformerInputAgent implements ScriptComponent {
    directionRight = true;
    gameObject: ControllableCharacter & Phaser.GameObjects.GameObject;
    scene: Phaser.Scene;

    resetTimer = 0;

    targetObject?: Phaser.GameObjects.GameObject;

    currentSelectedPath: Point[] = [];


    pathGraphics: Phaser.GameObjects.Graphics;

    constructor(_scene: Phaser.Scene, gameObject: ControllableCharacter & Phaser.GameObjects.GameObject) {
        this.gameObject = gameObject;
        this.scene = _scene;


        this.pathGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
    }

    createPathDebugSpline() {
        this.pathGraphics.clear();

        for (let i = 0; i < this.currentSelectedPath.length - 1; i++) {
            const line = new Phaser.Geom.Line(this.currentSelectedPath[i].x, this.currentSelectedPath[i].y, this.currentSelectedPath[i + 1].x, this.currentSelectedPath[i + 1].y);
            this.pathGraphics.strokeLineShape(line);
        }
    }

    setTarget(targetObject?: Phaser.GameObjects.GameObject) {
        this.targetObject = targetObject;
    }

    calculatePathToTarget(): NavigationState {
        if (!this.targetObject) {
            return NavigationState.NOT_FOUND;
        }

        const from = this.gameObject.body.position;
        const to = this.targetObject.body.position;
        const dist = this.calculateDistance(from, to);
        if (dist < 30) return NavigationState.ARRIVED;

        const {findPointNear} = this.scene.navMesh;
        const start = this.scene.navMesh.findPointNear(from.x, from.y);
        const destination = this.scene.navMesh.findPointNear(to.x, to.y);

        if (!start || !destination) {
          return NavigationState.NOT_FOUND;
        }

        const { vertices, edges, columns } = this.scene.navMesh.mesh;
        const planner = new PathPlanner(vertices, edges); //new PathPlanner(vertices, edges);
        this.currentSelectedPath = planner.execute(PointToKey(start), PointToKey(destination));
        if (this.currentSelectedPath.length > 0) {
            this.createPathDebugSpline();
        }

        return NavigationState.FOUND;
    }

    calculateDistance(fromNode, toNode) {
        return Math.sqrt(Math.pow((fromNode.x - toNode.x), 2) + Math.pow((fromNode.y - toNode.y), 2));
    }

    update(delta: number) {
        this.resetTimer += delta;
        if (this.resetTimer > resetInterval) {
            this.resetTimer = 0;
            this.calculatePathToTarget();
        }

        this.createPathDebugSpline();

        if (this.currentSelectedPath.length === 0) {
            this.gameObject.direction.up = false;
            this.gameObject.body.velocity.x = 0;
            this.gameObject.direction.right = false;
            this.gameObject.direction.left = false;
            return;
        }


        const nextPathPoint = this.currentSelectedPath[0];

        const pos = this.gameObject.body.position;
        const target = this.scene.navMesh.findPointNear(pos.x, pos.y);

        this.gameObject.direction.right = target.x < nextPathPoint.x;
        this.gameObject.direction.left = target.x > nextPathPoint.x;

        if (target.y - nextPathPoint.y >= 30) {
            this.gameObject.direction.up = true;
        }

//      the waypoint on the ground below is reached. Delete
        if (this.calculateDistance(nextPathPoint, target) < 30) {
            this.currentSelectedPath.shift();
        }


        
    }
    destroy() { }
};

function PointToKey(p: Point) {
    return `${p.x}:${p.y}`;
}
