
import defaultStyle from '../../engine/ui/style';

export const usePanel = ({
    position,
    foreground = null,
    background = 'primary',
    width = 64,
    height = 2,
    style = defaultStyle,
    drawCamera,
    zIndex
}) => {

    const state = {
        foreground,
        background
    };

    const getForeground = () => state.foreground;
    const setForeground = foreground => state.foreground = foreground;

    const getBackground = () => state.background;
    const setBackground = background => state.background = background;

    const draw = () => {

        drawCamera.requestDraw(ctx => {

            const {x, y} = position.getPosition();

            const drawX = x - width / 2;
            const drawY = y - height / 2;

            ctx.beginPath();
            ctx.strokeStyle = ctx.fillStyle = style[getBackground()];

            ctx.rect(
                drawX, 
                drawY, 
                width, 
                height
            );
            ctx.fill();

            if (!getForeground()) return;

            ctx.strokeStyle = style[getForeground()];
            ctx.stroke();
            
        },
        zIndex);
    };

    return {
        getForeground,
        setForeground,
        getBackground,
        setBackground,
        actions: {
            draw
        }
    };
};