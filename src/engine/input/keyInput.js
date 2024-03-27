import { timestamp, lastTimestamp } from '../game';

export const useKeyInput = () => {

    const keys = {};

    const isKeyDown = key => !!keys[key] || false;

    const wasKeyPressed = key => {

        if (!keys[key]) return false;
        return keys[key].pressTime >= lastTimestamp();
    }

    const keyDown = e => {
        
        const key = e.code;
        keys[key] = keys[key] || { 
            pressTime: timestamp()
        };
    };

    const keyUp = e => {

        const key = e.code;
        keys[key] = null;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return {
        isKeyDown,
        wasKeyPressed
    };
};