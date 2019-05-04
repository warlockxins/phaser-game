export function addAnimation(scene, animations) {
    animations.forEach(
        ({ name, baseTexture, frameNames, frameRate, repeat }) => {
            scene.anims.create({
                key: name,
                frames: scene.anims.generateFrameNames(baseTexture, frameNames),
                frameRate,
                repeat: repeat
            });
        }
    );
}
