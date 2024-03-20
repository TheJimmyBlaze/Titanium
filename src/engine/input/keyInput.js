import { timestamp } from '../game';

export const useKeyInput = () => {

    const keys = {};

    const isKeyDown = key => keys[key]?.value || false;

    const wasKeyPressed = key => {

        if (!keys[key]) return false;

        if (!keys[key].pressTime) {
            keys[key].pressTime = timestamp();
        }

        if (keys[key].pressTime !== timestamp()) return false;
        return keys[key].value;
    }

    const keyDown = e => {
        
        const key = e.code;
        keys[key] = keys[key] || { 
            pressTime: null,
            value: true
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