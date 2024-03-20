import { timestamp } from '../game';

export const useMouseInput = () => {

    const mouseButtons = {};
    const isMouseDown = button => mouseButtons[button]?.value || false;

    const wasMousePressed = button => {

        if (!mouseButtons[button] || !mouseButtons[button].value) return false;

        const { value } = mouseButtons[button];
        mouseButtons[button].value = false;

        return value;
    }

    const mouseDown = e => {

        const button = e.button;
        mouseButtons[button] = mouseButtons[button] || { value: true}
    };

    const mouseUp = e => {

        const button = e.button;
        mouseButtons[button] = null;
    };
    
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);

    const wheelState = {
        deltaTimestamp: 0,
        delta: 0
    };

    const getWheelDelta = () => {

        const {
            deltaTimestamp,
            delta
        } = wheelState;
        
        if (deltaTimestamp !== timestamp()) {
            wheelState.deltaTimestamp = timestamp();
            wheelState.delta = 0;
        }

        return delta;
    }

    const wheel = e => {

        const delta = e.deltaY;
        wheelState.delta = getWheelDelta() + delta;
    };

    window.addEventListener('wheel', wheel);

    document.oncontextmenu = e => e.preventDefault();

    return {
        isMouseDown,
        wasMousePressed,
        getWheelDelta
    };
};