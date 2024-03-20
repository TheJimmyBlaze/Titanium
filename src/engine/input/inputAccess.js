import { useKeyInput } from './keyInput';
import { useMouseInput } from './mouseInput';

export const useInputAccess = () => {

    const keyInput = useKeyInput();
    const mouseInput = useMouseInput();

    const binds = {};
    const getBinds = () => binds;

    const inputs = {};
    const getInput = () => inputs;

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

        inputs[alias] = () => {

            if (!primary && !secondary) return false;

            return (
                keyInput.isKeyDown(primary?.key) ||
                mouseInput.isMouseDown(primary?.mouseButton) ||
                keyInput.isKeyDown(secondary?.key) ||
                mouseInput.isMouseDown(secondary?.mouseButton)
            );
        };
    };

    return {
        getBinds,
        setBind,
        getInput,
        getMouseWheelDelta: mouseInput.getWheelDelta
    };
};