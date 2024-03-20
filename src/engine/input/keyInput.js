
export const useKeyInput = () => {

    const keys = [];
    const isKeyDown = key => keys.indexOf(key) !== -1;

    const keyDown = e => {
        
        const key = e.code;
        keys.push(key);
    };

    const keyUp = e => {

        const key = e.code;
        keys.splice(keys.indexOf(key), 1);
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    return {
        isKeyDown
    };
};