
import { lerp } from '../../engine/math';
import defaultStyle from '../../engine/ui/style';

export const useProgressBar = ({
    position,
    foreground = 'primary',
    background = 'dark',
    value = 0,
    max = 100,
    orientation = 'horizontal',
    width = 64,
    height = 2,
    style = defaultStyle,
    drawCamera
}) => {

    const state = {
        value,
        targetValue: value,
        max,
        foreground,
        background
    };

    const getValue = () => state.value;
    const setValue = value => state.targetValue = value;

    const increment = value => state.targetValue += value;
    
    const getMax = () => state.max;
    const setMax = max => state.max = max;

    const setForeground = foreground => state.foreground = foreground;
    const setBackground = background => state.background = background;

    const getProgress = () => state.value / state.max;

    const update = () => {

        state.value = lerp(state.value, state.targetValue, 0.0001);
    };

    const draw = () => {

        drawCamera.requestDraw(ctx => {

            const {x, y} = position.getPosition();

            const drawX = x - width / 2;
            const drawY = y - height / 2;
            
            if (style[background]) {

                ctx.beginPath();
                ctx.strokeStyle = ctx.fillStyle = style[state.background];
    
                ctx.rect(
                    drawX, 
                    drawY, 
                    width, 
                    height
                );
                ctx.fill();
            }

            if (!getProgress()) return;

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = style[state.foreground];
            ctx.rect(
                drawX,
                drawY + (orientation === 'vertical' && (height - height * getProgress())),
                width * (orientation !== 'horizontal' || getProgress()),
                height * (orientation !== 'vertical' || getProgress())
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
        setForeground,
        setBackground,
        actions: {
            update,
            draw
        }
    };
};