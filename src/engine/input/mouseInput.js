import { timestamp } from '../game';

export const useMouseInput = () => {

    const mouseButtons = {};
    const isMouseDown = button => mouseButtons[button]?.value || false;

    const wasMousePressed = button => {

        if (!mouseButtons[button]) return false;

        if (!mouseButtons[button].pressTime) {
            mouseButtons[button].pressTime = timestamp();
        }

        if (mouseButtons[button].pressTime !== timestamp()) return false;
        return mouseButtons[button].value;
    }

    const mouseDown = e => {

        const button = e.button;
        mouseButtons[button] = mouseButtons[button] || { 
            pressTime: null,
            value: true
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

        if (!wheelState.timestamp) {
            wheelState.timestamp = timestamp();
        }

        if (wheelState.timestamp !== timestamp()) {
            wheelState.delta = 0;
        }
        return wheelState.delta;
    }

    const wheel = e => {

        const delta = e.deltaY;
        
        if (wheelState.timestamp != null) {
            wheelState.delta = 0;
        }
        wheelState.timestamp = null;
        wheelState.delta += delta;
    };

    window.addEventListener('wheel', wheel);

    document.oncontextmenu = e => e.preventDefault();

    return {
        isMouseDown,
        wasMousePressed,
        getWheelDelta
    };
};