
export const useCanvas = ({
    elementId
}) => {

    if (!elementId) throw new error('element id is not defined');

    const canvas = document.getElementById(elementId);

    const ctx = canvas.getContext('2d');

    canvas.style.boxSizing = 'content-box';
    canvas.style.display = 'inline-block';
    
    const getComputedSize = () => {
        
        const cs = getComputedStyle(canvas);

        const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        
        const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        
        return {
            width: canvas.offsetWidth - paddingX - borderX,
            height: canvas.offsetHeight - paddingY - borderY
        };
    };

    const state = {
        width: getComputedSize().width,
        height: getComputedSize().height
    };

    console.log(state);

    const getWidth = () => state.width;
    const getHeight = () => state.height;

    const resizeRegistrations = [];
    const registerResizeEvent = callback => {
        resizeRegistrations.unshift({callback});
        update(true);
    }
        
    const update = forceResize => {

        const requiresResize = (
            forceResize ||
            getComputedSize().width !== getWidth() ||
            getComputedSize().height !== getHeight()
        );

        if (requiresResize) {

            state.width = getComputedSize().width;
            state.height = getComputedSize().height;

            canvas.width = state.width;
            canvas.height = state.height;

            if (resizeRegistrations.length > 0) {
                resizeRegistrations.forEach(registration => registration.callback());
            }
        }
    };

    return {
        canvas,
        ctx,
        getWidth,
        getHeight,
        registerResizeEvent,
        update
    };
};

export default useCanvas;