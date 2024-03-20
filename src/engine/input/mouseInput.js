import { timestamp } from '../game';

export const useMouseInput = () => {

    const mouseButtons = {};
    const isMouseDown = button => !!mouseButtons[button];

    const wasMousePressed = button => {

        if (!mouseButtons[button]) return false;
        return mouseButtons[button].pressTime === timestamp()
    }

    const mouseDown = e => {

        const button = e.button;
        mouseButtons[button] = mouseButtons[button] || { 
            pressTime: timestamp()
        }
    };

    const mouseUp = e => {

        const button = e.button;
        mouseButtons[button] = null;
    };
    
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);

    const wheelState = {
        timestamp: null,
        delta: 0
    };
    const getWheelDelta = () => {

        if (wheelState.timestamp !== timestamp()) return 0;
        return wheelState.delta;
    }

    const wheel = e => {

        const delta = e.deltaY;
        wheelState.delta = getWheelDelta() + delta;
        wheelState.timestamp = timestamp();
    };

    window.addEventListener('wheel', wheel);

    document.oncontextmenu = e => e.preventDefault();

    return {
        isMouseDown,
        wasMousePressed,
        getWheelDelta
    };
};