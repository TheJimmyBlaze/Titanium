
import { input } from '../../engine/game';
import { useRectCollider } from '../collision/rectCollider';
import { usePointCollider } from '../collision/pointCollider';
import defaultStyle from '../../engine/ui/style';

export const useButton = ({
    position,
    text,
    callback,
    bind,
    hotBind,
    foreground = 'light',
    background = 'primary',
    disabledBackground = 'gray800',
    disabled = false,
    width = 64,
    height = 32,
    padding = 8,
    style = defaultStyle,
    drawCamera,
    zIndex
}) => {

    if (!bind) throw new Error('Button must define bind');

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
        bindDown: false,
        hotDown: false,
        hover: false
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
      
        if (getDisabled()) return style[disabledBackground];

        if (state.bindDown || state.hotDown) return style.darken(style[getBackground()]);

        return style[getBackground()];
    };

    const update = () => {
        
        if (state.disabled) return;

        const mousePosition = input().getMousePosition(drawCamera);
        const mouseCollider = usePointCollider({position: mousePosition});

        if (collider.overlaps(mouseCollider)) {

            state.hover = true;

            if (input().isDown(bind)) {
                state.bindDown = true;
            } else if (state.bindDown) {
                callback();
                state.bindDown = false;
            }
        } else {

            state.hover = false;
            state.bindDown = false;
        }

        if (!hotBind) return;

        const hotDown = input().isDown(hotBind);
        if (!hotDown && state.hotDown)  {
            callback();
        }
        state.hotDown = hotDown;
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

            if ((state.hover || state.hotDown) && !state.disabled) {
                ctx.fill();
            } else {
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = !state.disabled && style[getForeground()] || getColour();

            ctx.font = `16px ${style.font}`;
            ctx.textAlign = 'left';

            ctx.fillText(
                state.text,
                drawX + padding,
                y + 6
            );

            const hint = input().getBinds()[hotBind].hint;
            if (!hotBind || !hint) {
                return ctx.stroke();
            }

            ctx.textAlign = 'right';
            ctx.strokeStyle = ctx.fillStyle = style[getBackground()];

            ctx.fillText(
                hint,
                drawX + width - padding,
                y + 6
            );
        },
        zIndex);
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