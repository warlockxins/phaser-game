export function addAnimation(scene, animations) {
    animations.forEach(({ name, baseTexture, frames, frameRate, repeat }) => {
        scene.anims.create({
            key: name,
            frames: scene.anims.generateFrameNames(baseTexture, frames),
            frameRate,
            repeat: repeat
        });
    });
}
