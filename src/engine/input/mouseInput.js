import { timestamp } from '../game';

export const useMouseInput = () => {

    const state = {
        deltaTimestamp: 0,
        delta: 0
    };

    const getWheelDelta = () => {

        const delta = state.delta;
        
        if (state.deltaTimestamp !== timestamp()) {
            state.deltaTimestamp = timestamp();
            state.delta = 0;
        }

        return delta;
    }

    const mouseButtons = [];
    const isMouseDown = button => mouseButtons.indexOf(button) !== -1;

    const mouseDown = e => {

        const button = e.button;
        mouseButtons.push(button);
    };

    const mouseUp = e => {

        const button = e.button;
        mouseButtons.splice(mouseButtons.indexOf(button, 1));
    };

    const wheel = e => {

        const delta = e.deltaY;
        state.delta = getWheelDelta() + delta;
    };

    document.oncontextmenu = e => e.preventDefault();
    window.addEventListener('wheel', wheel);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);

    return {
        isMouseDown,
        getWheelDelta
    };
};