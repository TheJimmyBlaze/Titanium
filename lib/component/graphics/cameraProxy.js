import { useCamera } from './camera';

export const useCameraProxy = ({
    position,
    width,
    height,
    drawCamera,
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
                x - width / 2,
                y - height / 2,
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