
import { colours as defaultColours } from '../../engine/ui/colours';

export const useText = ({
    position,
    text,
    font = 'courier new',
    size = 12,
    alignment = 'left',
    opacity = 1,
    foreground = 'light',
    colours = defaultColours,
    drawCamera
}) => {

    const state = {
        text,
        opacity
    };

    const getText = () => state.text;
    const setText = text => state.text = text;

    const getOpacity = () => state.opacity;
    const setOpacity = opacity => state.opacity = opacity;

    const draw = () => {

        drawCamera.requestDraw(ctx => {

            const prevAlpha = ctx.globalAlpha;

            const {x, y} = position.getPosition();

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = colours[foreground];

            ctx.textAlign = alignment;
            ctx.font = `${size}px ${font}`;

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
        getOpacity,
        setOpacity,
        actions: {
            draw
        }
    };
};