import { timestamp } from '../game';

export const useKeyInput = () => {

    const keys = {};

    const isKeyDown = key => keys[key]?.value || false;

    const wasKeyPressed = key => {

        if (
            !keys[key] || 
            !keys[key].value || 
            keys[key].pressTime == null
        ) return false;

        const { value } = keys[key];
        keys[key].pressTime = null;

        return value;
    }

    const keyDown = e => {
        
        const key = e.code;
        keys[key] = keys[key] || { 
            pressTime: timestamp(),
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