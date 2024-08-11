
import { input } from '../../engine/game';
import { useRectCollider } from '../collision/rectCollider';
import { usePointCollider } from '../collision/pointCollider';
import { colours as defaultColours, darken } from '../../engine/ui/colours';
import { usePosition } from '../position/position';

export const useButton = ({
    position,
    text,
    callback,
    bind,
    variant = 'primary',
    disabled = false,
    width = 64,
    height = 32,
    colours = defaultColours,
    font,
    drawCamera
}) => {

    const collider = useRectCollider({
        position,
        width,
        height
    });

    const state = {
        text,
        disabled,
        hover: false,
        mouseDown: false
    };

    const getText = () => state.text;
    const setText = text => state.text = text;

    const getDisabled = () => state.disabled;
    const setDiabled = disabled => state.disabled = disabled;

    const getColour = () => {
      
        if (state.disabled) return colours.gray800;

        if (state.mouseDown) return darken(colours[variant]);

        return colours[variant];
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
            ctx.strokeStyle = ctx.fillStyle = !state.disabled && colours.light || getColour();

            ctx.textAlign = 'left';
            ctx.font = font;

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
        getDisabled,
        setDiabled,
        actions: {
            update,
            draw
        }
    };
};