
import { lerp } from '../../engine/math';
import defaultStyle from '../../engine/ui/style';

export const useRadialBar = ({
    position,
    foreground = 'primary',
    background = 'dark',
    value = 0,
    max = 100,
    radius = 16,
    thickness = 3,
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

    const getDisplayValue = () => state.value;
    const getValue = () => state.targetValue;
    const setValue = value => state.targetValue = value;

    const increment = value => state.targetValue += value;
    
    const getMax = () => state.max;
    const setMax = max => state.max = max;

    const getProgress = () => state.value / state.max;

    const getForeground = () => state.foreground;
    const setForeground = foreground => state.foreground = foreground;

    const getBackground = () => state.background;
    const setBackground = background => state.background = background;

    const update = () => {

        state.value = lerp(state.value, state.targetValue, 0.0001);
    };

    const draw = () => {

        drawCamera.requestDraw(ctx => {

            const prevWidth = ctx.lineWidth;
            ctx.lineWidth = thickness;

            const {x, y} = position.getPosition();

            const drawX = x;
            const drawY = y + radius;
            
            const startRadians = Math.PI / 2;

            if (style[getBackground()]) {

                ctx.moveTo(drawX, drawY);
                ctx.beginPath();

                ctx.strokeStyle = ctx.fillStyle = style[getBackground()];
                ctx.arc(
                    x,
                    y,
                    radius,
                    startRadians,
                    2 * Math.PI + startRadians
                );

                ctx.stroke();
            }

            if (!getProgress()) return;

            ctx.moveTo(drawX, drawY);
            ctx.beginPath();

            ctx.strokeStyle = ctx.fillStyle = style[getForeground()];
            ctx.arc(
                x,
                y,
                radius,
                startRadians,
                2 * Math.PI * getProgress() + startRadians
            );

            ctx.stroke();
            ctx.lineWidth = prevWidth;
        });
    };

    return {
        getDisplayValue,
        getValue,
        setValue,
        increment,
        getMax,
        setMax,
        getProgress,
        getForeground,
        setForeground,
        getBackground,
        setBackground,
        actions: {
            update,
            draw
        }
    };
};