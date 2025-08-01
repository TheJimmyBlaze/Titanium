import { timestamp } from '../../engine/game';
import { useSpriteOptions } from '../../engine/graphics/spriteOptions';

export const useSprite = ({
    name,
    position,
    camera,
    frames,
    fps = 0,
    options = useSpriteOptions()
}) => {

    if (name == null) throw new Error('name is not defined');
    if (!position) throw new Error('position is not defined');
    if (!camera) throw new Error('camera is not defined');
    if (!frames || frames.length === 0)  throw new Error('frames must contain at least one element');

    const frameInterval = 1000 / fps;

    let currentFrame = 0;
    let lastFrameChange = timestamp();

    const getWidth = () => frames[currentFrame].frameWidth;
    const getHeight = () => frames[currentFrame].frameHeight;

    const frameEvents = [];
    const registerFrameEvent = (index, callback) => {

        frameEvents.push({
            index,
            callback
        });
    };

    const animate = reverse => {

        if (lastFrameChange + frameInterval < timestamp()) {

            currentFrame += (-1 * reverse || 1);
            if (currentFrame >= frames.length) {
                currentFrame = 0;
            }
            if (currentFrame < 0) {
                currentFrame = frames.length -1;
            }

            frameEvents.filter(event => event.index === currentFrame).forEach(event => event.callback());

            lastFrameChange = timestamp();
        }
    };

    const draw = () => {

        animate(options.getReverse());

        frames[currentFrame].draw(position, camera, options);
    };

    return {
        name,
        options,
        getWidth,
        getHeight,
        registerFrameEvent,
        actions: {
            draw
        }
    };
};