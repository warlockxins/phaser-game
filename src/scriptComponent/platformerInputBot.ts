import { ScriptComponent } from "./scriptComponent";

interface BotInput {
    directionRight: boolean;
    timer: any;
}

export const platformerInputBot: ScriptComponent & BotInput = {
    directionRight: true,
    timer: null,
    start(scene, gameObject) {
        if (!gameObject.direction) {
            throw new Error("Missing Sprite 'direction'");
        }
        gameObject.direction.right = this.directionRight;
    },
    update(gameObject) {
        if (gameObject.body.onWall()) {
            this.directionRight = !this.directionRight;
            gameObject.direction.right = this.directionRight;
            gameObject.direction.left = !this.directionRight;
        }
    },
    destroy() {
        // clearTimeout(this.timer);
        // this.timer = null;
    }
};
