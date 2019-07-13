export const platformerInputBot = {
    directionRight: true,
    timer: null,
    start(scene, gameObject) {
        if (!gameObject.direction) {
            throw new Error("Missing Sprite 'direction'");
        }

        this.timer = setInterval(() => {
            gameObject.direction.right = this.directionRight;
            gameObject.direction.left = !this.directionRight;
            this.directionRight = !this.directionRight;
        }, 2000);
    },
    update(gameObject) {},
    destroy() {
        clearTimeout(this.timer);
        this.timer = null;
    }
};
