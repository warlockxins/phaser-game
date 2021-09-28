import { ControllableCharacter, ScriptComponent } from "~/Sprite/interfaces";
import { PathPlanner } from '../levelComponents/PathPlanner';

const resetInterval = 1000;

type Point = {
    x: number, y: number
}

enum NavigationState {
    FOUND,
    NOT_FOUND,
    ARRIVED
}

export class PlatformerInputAgent implements ScriptComponent {
    gameObject: ControllableCharacter & Phaser.GameObjects.GameObject;
    scene: Phaser.Scene;

    resetTimer = 0;
    targetObject?: Phaser.GameObjects.GameObject;

    currentSelectedPath: Point[] = [];
    pathGraphics: Phaser.GameObjects.Graphics;

    navigationState: NavigationState = NavigationState.NOT_FOUND;

    constructor(_scene: Phaser.Scene, gameObject: ControllableCharacter & Phaser.GameObjects.GameObject) {
        this.gameObject = gameObject;
        this.scene = _scene;
    }

    createPathDebugSpline() {
        if (!this.scene.game.config.physics.arcade.debug) {
            return;
        }

        if (!this.pathGraphics) {
            this.pathGraphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
        }

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

        const { findPointNear } = this.scene.navMesh;
        const start = this.scene.navMesh.findWayPointBelow(from.x, from.y);
        const destination = this.scene.navMesh.findWayPointBelow(to.x, to.y);

        if (!start || !destination) {
            return NavigationState.NOT_FOUND;
        }

        const { vertices, edges, columns } = this.scene.navMesh.mesh;
        const planner = new PathPlanner(vertices, edges);
        this.currentSelectedPath = planner.execute(PointToKey(start), PointToKey(destination));

        return NavigationState.FOUND;
    }

    calculateDistance(fromNode, toNode) {
        return Math.sqrt(Math.pow((fromNode.x - toNode.x), 2) + Math.pow((fromNode.y - toNode.y), 2));
    }

    resetControls() {
        this.gameObject.direction.x = 0;
        this.gameObject.direction.y = 0;
    }

    update(delta: number) {
        this.resetControls();
        this.resetTimer += delta;

        if (this.gameObject.isOnGround() && this.resetTimer > resetInterval) {
            this.resetTimer = 0;
            this.navigationState = this.calculatePathToTarget();
        }

        if (this.navigationState === NavigationState.ARRIVED || this.navigationState === NavigationState.NOT_FOUND) {
            return;
        }

        this.createPathDebugSpline();

        // Navigate to first point

        if (this.currentSelectedPath.length === 0) {
            this.gameObject.body.velocity.x = 0;
            return;
        }

        const nextPathPoint = this.currentSelectedPath[0];
        const pos = this.gameObject.body.position;
        const target = this.scene.navMesh.findWayPointBelow(pos.x, pos.y);

        this.gameObject.direction.x = nextPathPoint.x - pos.x;

        if (this.calculateDistance(pos, nextPathPoint) < 30) {
            this.currentSelectedPath.shift();
        }


       if (target?.y - nextPathPoint.y > 30) {
           this.gameObject.direction.y = 1;
           this.gameObject.direction.x = 0;
           // in air, so remove next point immediately. Then Ai will be able to focus on next point.
           this.currentSelectedPath.shift();
        }
    }

    destroy() { }
};

function PointToKey(p: Point) {
    return `${p.x}:${p.y}`;
}

