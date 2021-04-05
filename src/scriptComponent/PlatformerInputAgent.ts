import { ControllableCharacter, ScriptComponent } from "~/Sprite/interfaces";
import { PathPlanner } from '../levelComponents/PathPlanner';

const resetInterval = 500;

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
        if (dist < 40) return NavigationState.ARRIVED;

        // hack
        // from.x += 10;
        from.y += 60;
        const fromPosition = vectorToNavMeshNodePosition(from, 30, 30);

        // hack
        to.y += 60;
        const toPosition = vectorToNavMeshNodePosition(to, 30, 30);


        const { vertices, edges } = this.scene.navMesh.mesh;
        const planner = new PathPlanner(vertices, edges); //new PathPlanner(vertices, edges);

        const result: Point[] = planner.execute(PointToKey(fromPosition), PointToKey(toPosition));
        if (result.length > 0) {
            this.currentSelectedPath = result.map(({ x, y }) => ({
                x: x + 15,
                y: y
            }));

            this.createPathDebugSpline();
        }

        return NavigationState.ARRIVED
    }

    calculateDistance(fromNode, toNode) {
        return Math.sqrt(Math.pow((fromNode.x - toNode.x), 2) + Math.pow((fromNode.y - toNode.y), 2));
    }

    deleteClosestPoints() {
        // cleanup points that are close ... from end
        let current = - 1;
        for (let i = this.currentSelectedPath.length - 1; i > -1; i--) {
            if (this.calculateDistance(this.gameObject.body.position, this.currentSelectedPath[i]) < 35) {
                current = i;
                break
            }
        }
        if (current > -1) {
            this.currentSelectedPath.splice(0, current + 1);
            this.createPathDebugSpline()
        }
    }


    update(delta: number) {
        this.resetTimer += delta;
        if (this.resetTimer > resetInterval) {
            this.resetTimer = 0;
            this.calculatePathToTarget();
        }

        this.deleteClosestPoints();

        if (this.currentSelectedPath.length === 0) {
            this.gameObject.direction.up = false;
            this.gameObject.body.velocity.x = 0;
            this.gameObject.direction.right = false;
            this.gameObject.direction.left = false;
            return;
        }


        const nextPathPoint = this.currentSelectedPath[0];

        if (this.calculateDistance(nextPathPoint, this.gameObject.body.position) < 40) {
            this.gameObject.direction.right = false;
            this.gameObject.direction.left = false;
            return
        }

        this.gameObject.direction.right = this.gameObject.body.position.x < nextPathPoint.x;
        this.gameObject.direction.left = this.gameObject.body.position.x > nextPathPoint.x;

        if (this.gameObject.body.position.y - nextPathPoint.y >= 40) {
            this.gameObject.direction.up = true;
        }
    }
    destroy() { }
};

function vectorToNavMeshNodePosition(v: { x: number, y: number }, tileWidth: number, tileHeight: number): Point {
    const x = Math.floor(v.x / tileWidth) * tileWidth;
    const y = Math.floor(v.y / tileHeight) * tileHeight;
    return {
        x, y
    }
}

function PointToKey(p: Point) {
    return `${p.x}:${p.y}`;
}