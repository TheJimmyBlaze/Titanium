
import { lerp } from '../../engine/math';
import { colours as defaultColours } from '../../engine/ui/colours';

export const useProgressBar = ({
    position,
    variant = 'primary',
    background = 'dark',
    value = 0,
    max = 100,
    width = 64,
    height = 2,
    colours = defaultColours,
    drawCamera
}) => {

    const state = {
        value,
        targetValue: value,
        max
    };

    const getValue = () => state.value;
    const setValue = value => state.targetValue = value;

    const increment = value => state.targetValue += value;
    
    const getMax = () => state.max;
    const setMax = max => state.max = max;

    const getProgress = () => state.value / state.max;

    const update = () => {

        state.value = lerp(state.value, state.targetValue, 0.0001);
    };

    const draw = () => {

        drawCamera.requestDraw(ctx => {
            
            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = colours[background];

            const {x, y} = position.getPosition();

            const drawX = x - width / 2;
            const drawY = y - height / 2;

            ctx.rect(
                drawX, 
                drawY, 
                width, 
                height
            );
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = colours[variant];
            ctx.rect(
                drawX,
                drawY,
                width * getProgress(),
                height
            );

            ctx.fill();
        });
    };

    return {
        getValue,
        setValue,
        increment,
        getMax,
        setMax,
        getProgress,
        actions: {
            update,
            draw
        }
    };
};