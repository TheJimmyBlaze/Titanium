import { nanoid } from 'nanoid';
import { timestamp, lastTimestamp } from '../game';

export const useKeyInput = () => {

    const keys = {};

    const isKeyDown = key => !!keys[key] || false;

    const wasKeyPressed = key => {

        if (!keys[key]) return false;
        return keys[key].pressTime > lastTimestamp();
    };

    const keyDownCallbacks = {};
    const keyPressCallbacks = {};

    const registerKeyDown = callback => {
        const callbackId = nanoid();
        keyDownCallbacks[callbackId] = callback;
        return callbackId;
    };
    const deregisterKeyDown = callbackId => delete keyDownCallbacks[callbackId];

    const registerKeyPress = callback => {
        const callbackId = nanoid();
        keyPressCallbacks[callbackId] = callback;
        return callbackId;
    };
    const deregisterKeyPress = callbackId => delete keyPressCallbacks[callbackId];

    const keyDown = e => {

        Object.values(keyDownCallbacks).forEach(callback => !e.defaultPrevented && callback(e));
        
        if(e.defaultPrevented) return;
        
        const key = e.code;
        keys[key] = keys[key] || { 
            pressTime: timestamp()
        };
    };
    
    const keyUp = e => {
        
        const key = e.code;
        keys[key] = null;
    };

    const keyPress = e => {
        Object.values(keyPressCallbacks).forEach(callback => !e.defaultPrevented && callback(e));
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('keypress', keyPress);

    return {
        isKeyDown,
        wasKeyPressed,
        registerKeyDown,
        registerKeyPress,
        deregisterKeyDown,
        deregisterKeyPress
    };
};