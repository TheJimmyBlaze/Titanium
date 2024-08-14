
import defaultStyle from '../../engine/ui/style';

export const useText = ({
    position,
    text,
    size,
    alignment = 'left',
    opacity = 1,
    foreground = 'light',
    style = defaultStyle,
    drawCamera
}) => {

    const state = {
        text,
        foreground,
        opacity
    };

    const getText = () => state.text;
    const setText = text => state.text = text;

    const getForeground = () => state.foreground;
    const setForeground = foreground => state.foreground = foreground;

    const getOpacity = () => state.opacity;
    const setOpacity = opacity => state.opacity = opacity;

    const draw = () => {

        drawCamera.requestDraw(ctx => {

            const prevAlpha = ctx.globalAlpha;

            const {x, y} = position.getPosition();

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = style[getForeground()];

            ctx.textAlign = alignment;
            ctx.font = `${size || style.fontSize}px ${style.font}`;

            if (opacity !== prevAlpha) ctx.globalAlpha = opacity;

            ctx.fillText(
                state.text, 
                x, 
                y
            );
            ctx.stroke();

            if (opacity !== prevAlpha) ctx.globalAlpha = prevAlpha;
        });
    };

    return {
        getText,
        setText,
        getForeground,
        setForeground,
        getOpacity,
        setOpacity,
        actions: {
            draw
        }
    };
};