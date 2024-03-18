import { useFrame } from './frame';
import { useSprite } from './sprite';

export const useSpriteSheet = ({
    imagePath,
    sliceWidth,
    sliceHeight,
    runs
}) => {

    if (!imagePath) throw new Error('imagePath is not defined');
    if (sliceWidth == null) throw new Error('sliceWidth cannot be null');
    if (sliceHeight == null) throw new Error('sliceHeight cannot be null');
    if (!runs || runs.length === 0) throw new Error('runs must contain at least one element');

    const image = new Image();
    image.src = imagePath;

    const buildSpriteForRun = run => {

        const frames = [];
        for (let index = 0; index < run.spriteCount; index++) {

            const frame = useFrame({
                image,
                sliceWidth,
                sliceHeight,
                x: run.x + index,
                y: run.y,
                width: run.width,
                height: run.height
            });
            frames.push(frame);
        }

        return {
            name: run.name,
            frames
        };
    };

    const sprites = {};
    runs.forEach(run => {

        const sprite = buildSpriteForRun(run);

        sprites[sprite.name] = (
            position,
            camera,
            options = {}
        ) => useSprite({
            position,
            camera,
            frames: sprite.frames, 
            fps: run.fps,
            options
        });
    });

    return sprites;
};