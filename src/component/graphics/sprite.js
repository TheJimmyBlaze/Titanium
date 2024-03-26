import { timestamp } from '../../engine/game';

export const useSprite = ({
    name,
    position,
    camera,
    frames,
    fps = 0,
    options = {}
}) => {

    if (!name) throw new Error('name is not defined');
    if (!position) throw new Error('position is not defined');
    if (!camera) throw new Error('camera is not defined');
    if (!frames || frames.length === 0)  throw new Error('frames must contain at least one element');

    const state = {
        options
    };
    const getOptions = () => state.options;
    const setOptions = options => state.options = options;

    const frameInterval = 1000 / fps;

    let currentFrame = 0;
    let lastFrameChange = 0;

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

        animate(state.options.reverse);

        const {x, y} = position.getPosition();
        frames[currentFrame].draw(x, y, camera, state.options);
    };

    return {
        name,
        getOptions,
        setOptions,
        registerFrameEvent,
        actions: {
            draw
        }
    };
};