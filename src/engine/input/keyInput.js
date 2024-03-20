
export const useKeyInput = () => {

    const keys = {};
    const isKeyDown = key => keys[key] || false;

    const keyDown = e => {
        
        const key = e.code;
        keys[key] = true;
    };

    const keyUp = e => {

        const key = e.code;
        keys[key] = false;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return {
        isKeyDown
    };
};