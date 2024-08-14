
import { input } from '../../engine/game';
import { useRectCollider } from '../collision/rectCollider';
import { usePointCollider } from '../collision/pointCollider';
import defaultStyle from '../../engine/ui/style';

export const useButton = ({
    position,
    text,
    callback,
    bind,
    foreground = 'light',
    background = 'primary',
    disabledBackground = 'gray800',
    disabled = false,
    width = 64,
    height = 32,
    style = defaultStyle,
    drawCamera
}) => {

    const collider = useRectCollider({
        position,
        width,
        height
    });

    const state = {
        text,
        foreground,
        background,
        disabled,
        hover: false,
        mouseDown: false
    };

    const getText = () => state.text;
    const setText = text => state.text = text;

    const getForeground = () => state.foreground;
    const setForeground = foreground => state.foreground = foreground;

    const getBackground = () => state.background;
    const setBackground = background => state.background = background;

    const getDisabled = () => state.disabled;
    const setDisabled = disabled => state.disabled = disabled;

    const getColour = () => {
      
        if (state.disabled) return style[disabledBackground];

        if (state.mouseDown) return style.darken(style[getBackground()]);

        return style[getBackground()];
    };

    const update = () => {
        
        if (state.disabled) return;

        const mousePosition = input().getMousePosition(drawCamera);
        const mouseCollider = usePointCollider({position: mousePosition});

        if (collider.overlaps(mouseCollider)) {

            state.hover = true;

            if (input().isDown(bind)) {
                state.mouseDown = true;
            } else if (state.mouseDown) {
                callback();
                state.mouseDown = false;
            }
        } else {

            state.hover = false;
            state.mouseDown = false;
        }
    };

    const draw = () => {

        drawCamera.requestDraw(ctx => {

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = getColour();

            const {x, y} = position.getPosition();
            
            const drawX = x - width / 2;
            const drawY = y - height / 2;

            ctx.rect(
                drawX,
                drawY,
                width,
                height
            );

            if (state.hover && !state.disabled) {
                ctx.fill();
            } else {
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = !state.disabled && style[getForeground()] || getColour();

            ctx.textAlign = 'left';
            ctx.font = `16px ${style.font}`;

            ctx.fillText(
                state.text,
                drawX + 8,
                y + 5
            );

            ctx.stroke();
        });
    };

    return {
        getText,
        setText,
        getForeground,
        setForeground,
        getBackground,
        setBackground,
        getDisabled,
        setDisabled,
        actions: {
            update,
            draw
        }
    };
};