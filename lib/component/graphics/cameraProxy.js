import { usePosition } from '../position/position';
import { useCamera } from './camera';

export const useCameraProxy = ({
    position,
    drawCamera,
    width = drawCamera.getWidth(),
    height = drawCamera.getHeight(),
    offsetX = 0,
    offsetY = 0,
    zIndex
}) => {

    const element = document.createElement('canvas');
    element.width = width;
    element.height = height;

    const ctx = element.getContext('2d');
    const canvas = {
        ctx,
        getWidth: () => width,
        getHeight: () => height
    };

    const camera = useCamera({
        position,
        canvas
    });

    const effects = {};
    const addEffect = effect => effects[effect.id] = effect;
    const removeEffect = id => delete effects[id];

    const update = () => {
        
        ctx.clearRect(
            0, 0,
            width,
            height
        );
    };
    
    const draw = () => {
        
        update();
        camera.actions.commit();

        Object.values(effects).forEach(effect => effect.apply(ctx));

        drawCamera.requestDraw(ctx => {

            const {x, y} = position.getPosition();

            ctx.drawImage(
                element,
                x + offsetX - width / 2,
                y + offsetY - height / 2,
                width,
                height
            );
        },
        zIndex);
    };

    return {
        ...camera,
        addEffect,
        removeEffect,
        actions: {
            draw
        }
    };
};