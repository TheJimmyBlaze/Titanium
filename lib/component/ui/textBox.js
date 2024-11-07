
import { input } from '../../engine/game';
import { useRectCollider } from '../collision/rectCollider';
import { usePointCollider } from '../collision/pointCollider';
import defaultStyle from '../../engine/ui/style';

export const defaultWhitelist = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_+=[](){}<>;:\'\",.?\\/\`~!@#$%^&* ';

export const useTextBox = ({
    position,
    text = '',
    placeholder,
    whitelist = defaultWhitelist,
    submitCallback,
    activateBind,
    submitBind,
    width = 64,
    height = 32,
    padding = 8,
    foreground = 'light',
    border = 'gray400',
    activeBorder = 'primary',
    disabledBorder = 'gray800',
    caretColour = 'primary',
    disabled = false,
    style = defaultStyle,
    drawCamera,
    zIndex
}) => {

    const collider = useRectCollider({
        position,
        width,
        height
    });

    const state = {
        text,
        placeholder,
        foreground,
        border,
        caretColour,
        disabled,
        caretDistanceFromEndOfText: 0,
        active: false
    };

    const getText = () => state.text;
    const setText = text => state.text = text;

    const getPlaceholder = () => state.placeholder;
    const setPlaceholder = placeholder => state.placeholder = placeholder;

    const getForeground = () => state.foreground;
    const setForeground = foreground => state.foreground = foreground;

    const getCaretColour = () => state.caretColour;
    const setCaretColour = caretColour => state.caretColour = caretColour;

    const getDisabled = () => state.disabled;
    const setDisabled = disabled => state.disabled = disabled;

    const getColour = () => {
      
        if (getDisabled()) return style[disabledBorder];

        if (state.active) return style[activeBorder];

        return style[border];
    };

    const keyCallback = e => {

        if (!state.active) return;

        if (e.code === 'Backspace') {
            setText(
                getText().substring(0, getText().length - state.caretDistanceFromEndOfText -1) +
                getText().substring(getText().length - state.caretDistanceFromEndOfText, getText().length)
            );
            state.caretDistanceFromEndOfText = Math.max(0, state.caretDistanceFromEndOfText);
            return;
        }
        if (e.code === 'ArrowLeft') {
            state.caretDistanceFromEndOfText = Math.min(state.text.length, state.caretDistanceFromEndOfText +1);
            return;
        }
        if (e.code === 'ArrowRight') {
            state.caretDistanceFromEndOfText = Math.max(0, state.caretDistanceFromEndOfText -1);
            return;
        }

        const code = e.keyCode;
        const char = String.fromCharCode(code);

        console.log(char);
        if (whitelist.indexOf(char) === -1) return;

        setText(
            getText().substring(0, getText().length - state.caretDistanceFromEndOfText) +
            char +
            getText().substring(getText().length - state.caretDistanceFromEndOfText, getText().length)
        );
    };
    const callbackId = input().registerKeyCallback(keyCallback);

    const dispose = () => input().deregisterKeyCallback(callbackId);

    const update = () => {

        if (state.disabled) return;

        if (input().isDown(activateBind)) {

            const mousePosition = input().getMousePosition(drawCamera);
            const mouseCollider = usePointCollider({position: mousePosition});
            state.active = collider.overlaps(mouseCollider);
        }

        if (!submitBind || !submitCallback) return;

        if (input().isDown(submitBind))  {
            submitCallback();
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
            ctx.stroke();

            if (state.text === '') {

                ctx.beginPath();
                ctx.strokeStyle = ctx.fillStyle = style[disabledBorder];

                ctx.font = `16px ${style.font}`;
                ctx.textAlign = 'left';

                ctx.fillText(
                    state.placeholder,
                    drawX + padding,
                    y + 6
                );

                return;
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

            ctx.strokeStyle = ctx.fillStyle = style[getCaretColour()];

            const preCaretText = getText().substring(0, getText().length - state.caretDistanceFromEndOfText);
            ctx.fillText(
                '_',
                drawX + padding + ctx.measureText(preCaretText).width,
                y + 8
            );
        },
        zIndex);
    };
    
    return {
        getText,
        setText,
        getPlaceholder,
        setPlaceholder,
        getForeground,
        setForeground,
        getDisabled,
        setDisabled,
        dispose,
        actions: {
            update,
            draw
        }
    };
};