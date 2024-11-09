
import { input, timestamp } from '../../engine/game';
import { useRectCollider } from '../collision/rectCollider';
import { usePointCollider } from '../collision/pointCollider';
import defaultStyle from '../../engine/ui/style';

export const defaultWhitelist = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_+=[](){}<>;:\'\",.?\\/\`~!@#$%^&* ';
const caretBlinkRate = 800;
const submitCooldown = 50;

export const useTextBox = ({
    position,
    text = '',
    placeholder,
    whitelist = defaultWhitelist,
    activateBind,
    submitBind,
    submitCallback,
    updateCallback,
    width = 64,
    height = 32,
    padding = 8,
    foreground = 'light',
    border = 'gray400',
    activeBorder = 'primary',
    disabledBorder = 'gray800',
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
        disabled,
        caretDistanceFromEndOfText: 0,
        active: false
    };

    const getText = () => state.text;
    const setText = text => {
        
        state.text = text;
        updateCallback({
            getText
        });
    }

    const getPlaceholder = () => state.placeholder;
    const setPlaceholder = placeholder => state.placeholder = placeholder;

    const getForeground = () => state.foreground;
    const setForeground = foreground => state.foreground = foreground;

    const getDisabled = () => state.disabled;
    const setDisabled = disabled => state.disabled = disabled;

    const getColour = () => {
      
        if (getDisabled()) return style[disabledBorder];

        if (state.active) return style[activeBorder];

        return style[border];
    };

    let keyDownCallbackId = null;
    const keyDownCallback = e => {

        if (e.code === 'Tab') {
            submit();
            e.preventDefault();
            return;
        }
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
    };

    let keyPressCallbackId = null;
    const keyPressCallback = e => {
        
        const code = e.keyCode;
        const char = String.fromCharCode(code);

        if (whitelist.indexOf(char) === -1) return;

        setText(
            getText().substring(0, getText().length - state.caretDistanceFromEndOfText) +
            char +
            getText().substring(getText().length - state.caretDistanceFromEndOfText, getText().length)
        );

        e.preventDefault();
    };

    let lastSubmit = 0;
    const activate = () => {

        if (state.active) return;

        state.active = true;
        lastSubmit = timestamp();
        state.caretDistanceFromEndOfText = 0;

        keyDownCallbackId = input().registerKeyDown(keyDownCallback);
        keyPressCallbackId = input().registerKeyPress(keyPressCallback);

        window.addEventListener('blur', dispose);
    };

    const dispose = () => {

        state.active = false;

        input().deregisterKeyDown(keyDownCallbackId);
        input().deregisterKeyPress(keyPressCallbackId);
        
        window.removeEventListener('blue', dispose);
    };

    const submit = () => {

        if (
            !state.active || 
            timestamp() - lastSubmit < submitCooldown ||
            !submitCallback
        ) return;

        lastSubmit = timestamp();
        submitCallback({
            getText,
            setText,
            getDisabled,
            setDisabled,
            activate,
            dispose
        });
    };

    const update = () => {

        if (state.disabled) return;

        if (input().wasPressed(activateBind)) {

            const mousePosition = input().getMousePosition(drawCamera);
            const mouseCollider = usePointCollider({position: mousePosition});

            collider.overlaps(mouseCollider) ? activate() : dispose();
        }

        if (
            !state.active || 
            timestamp() - lastSubmit < submitCooldown ||
            !submitBind || 
            !submitCallback
        ) return;

        if (input().wasPressed(submitBind)) {
            submit();
        }
    };

    let lastCaretBlink = 0;
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

            ctx.beginPath();
            ctx.font = `16px ${style.font}`;
            ctx.textAlign = 'left';

            if (state.text.length === 0) {

                ctx.strokeStyle = ctx.fillStyle = style[disabledBorder];
                ctx.fillText(
                    state.placeholder,
                    drawX + padding,
                    y + 6
                );
            } else {

                ctx.strokeStyle = ctx.fillStyle = !state.disabled && style[getForeground()] || getColour();    
                ctx.fillText(
                    state.text,
                    drawX + padding,
                    y + 6
                );
            }

            if (!state.active) return;

            if (timestamp() - lastCaretBlink > caretBlinkRate * 2) {
                lastCaretBlink = timestamp();
                return;
            }

            if (timestamp() - lastCaretBlink > caretBlinkRate) return;
             
            const preCaretText = getText().substring(0, getText().length - state.caretDistanceFromEndOfText);
            const caretOffset = ctx.measureText(preCaretText).width;

            ctx.strokeStyle = ctx.fillStyle = style[activeBorder];
            ctx.fillText(
                '_',
                drawX + padding + caretOffset,
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
        activate,
        dispose,
        actions: {
            update,
            draw
        }
    };
};