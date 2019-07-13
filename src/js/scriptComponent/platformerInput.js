export const platformerInput = {
    start: (scene, gameObject) => {
        if (!gameObject.direction) {
            throw new Error("Missing Sprite 'direction': ");
        }
        gameObject.keyboard = scene.input.keyboard.addKeys("W, A, S, D");
    },
    update: gameObject => {
        gameObject.direction.left = gameObject.keyboard.A.isDown;
        gameObject.direction.right = gameObject.keyboard.D.isDown;
        gameObject.direction.up = gameObject.keyboard.W.isDown;
    }
};
