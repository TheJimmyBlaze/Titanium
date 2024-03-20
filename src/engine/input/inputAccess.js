
export const useInputAccess = ({
    keyInput,
    mouseInput
}) => {

    if (!keyInput) throw new Error('keyInput is not defined');
    if (!mouseInput) throw new Error('mouseInput is not defined');

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
                keyInput.isDown(primary.key) ||
                mouseInput.isDown(primary.mouseButton) ||
                keyInput.isDown(secondary.key) ||
                mouseInput.isDown(secondary.mouseButton)
            );
        };
    };

    return {
        getBinds,
        setBind,
        getInput
    };
};