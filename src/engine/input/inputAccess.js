import { useKeyInput } from './keyInput';
import { useMouseInput } from './mouseInput';
import { useMousePosition } from './mousePosition';

export const useInputAccess = () => {

    const keyInput = useKeyInput();
    const mouseInput = useMouseInput();
    const mousePosition = useMousePosition();

    const binds = {};
    const getBinds = () => binds;

    const isDownCallbacks = {};
    const isDown = () => isDownCallbacks;
    
    const wasPressedCallbacks = {};
    const wasPressed = () => wasPressedCallbacks;

    const setBind = ({
        alias,
        primary = null,
        secondary = null
    }) => {

        if (!alias) throw new Error('alias is not defined');

        const {
            key: primaryKey,
            mouseButton: primaryMouseButton
        } = primary || {};

        if (primaryKey && primaryMouseButton) throw new Error('primary bind must not specify both a key and a mouseButton'); 
        
        const {
            key: secondaryKey,
            mouseButton: secondaryMouseButton
        } = secondary || {};

        if (secondaryKey && secondaryMouseButton) throw new Error('secondary bind must not specify both a key and a mouseButton');

        binds[alias] = {
            primary,
            secondary
        };

        isDownCallbacks[alias] = () => {

            if (!primary && !secondary) return false;

            return (
                keyInput.isKeyDown(primary?.key) ||
                mouseInput.isMouseDown(primary?.mouseButton) ||
                keyInput.isKeyDown(secondary?.key) ||
                mouseInput.isMouseDown(secondary?.mouseButton)
            );
        };

        wasPressedCallbacks[alias] = () => {

            if (!primary && !secondary) return false;

            return (
                keyInput.wasKeyPressed(primary?.key) ||
                mouseInput.wasMousePressed(primary?.mouseButton) ||
                keyInput.wasKeyPressed(secondary?.key) ||
                mouseInput.wasMousePressed(secondary?.mouseButton)
            );
        };
    };

    return {
        getBinds,
        setBind,
        isDown,
        wasPressed,
        getMouseWheelDelta: mouseInput.getWheelDelta,
        getMousePosition: mousePosition.getRelativePosition
    };
};