import { nanoid } from 'nanoid';
import { timestamp, lastTimestamp } from '../game';

export const useKeyInput = () => {

    const keys = {};
    const callbacks = {};

    const isKeyDown = key => !!keys[key] || false;

    const wasKeyPressed = key => {

        if (!keys[key]) return false;
        return keys[key].pressTime > lastTimestamp();
    }

    const registerCallback = callback => {

        const callbackId = nanoid();
        callbacks[callbackId] = callback;

        return callbackId;
    };

    const deregisterCallback = callbackId => delete callbacks[callbackId];

    const keyDown = e => {
        
        const key = e.code;
        keys[key] = keys[key] || { 
            pressTime: timestamp()
        };

        Object.values(callbacks).forEach(callback => callback(e));
    };

    const keyUp = e => {

        const key = e.code;
        keys[key] = null;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return {
        isKeyDown,
        wasKeyPressed,
        registerCallback,
        deregisterCallback
    };
};