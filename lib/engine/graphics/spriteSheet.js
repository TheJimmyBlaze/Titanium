import { useFrame } from './frame';
import { useSprite } from '../../component/graphics/sprite';

export const useSpriteSheet = ({
    image,
    shader,
    sliceWidth,
    sliceHeight,
    runs
}) => {

    if (!image && !shader) throw new Error('image or shader must be defined');
    if (sliceWidth == null) throw new Error('sliceWidth cannot be null');
    if (sliceHeight == null) throw new Error('sliceHeight cannot be null');
    if (!runs || runs.length === 0) throw new Error('runs must contain at least one element');

    const buildSpriteForRun = run => {

        const frames = [];
        for (let index = 0; index < run.spriteCount; index++) {

            const frame = useFrame({
                image,
                shader,
                frameWidth: sliceWidth,
                frameHeight: sliceHeight,
                x: run.x + index,
                y: run.y,
                framesWide: run.width,
                framesHigh: run.height
            });
            frames.push(frame);
        }

        return {
            name: run.name,
            frames
        };
    };

    const sprites = {};
    runs.forEach((run, i) => {

        const sprite = buildSpriteForRun(run);

        sprites[sprite.name ?? i] = ({
            position,
            camera,
            options
        }) => useSprite({
            name: sprite.name ?? i,
            position,
            camera,
            frames: sprite.frames, 
            fps: run.fps,
            loop: run.loop,
            options
        });
    });

    return sprites;
};