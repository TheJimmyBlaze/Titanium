
export const CANVAS_TYPE_GLX = "titanium.canvas.glx";

export const useCanvasGlx = ({
    elementId,
    backgroundColour = null
}) => {

    if (!elementId) throw new Error('element id is not defined');

    const canvas = document.getElementById(elementId);
    canvas.style.boxSizing = 'content-box';
    canvas.style.display = 'inline-block';

    const glx = canvas.getContext('webgl');

    glx.enable(glx.BLEND);
    glx.blendFunc(glx.ONE, glx.ONE_MINUS_SRC_ALPHA);
    
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
        height: getComputedSize().height,
        backgroundColour
    };

    const getWidth = () => state.width;
    const getHeight = () => state.height;

    const setBackgroundColour = colour => state.backgroundColour = colour;

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
            glx.viewport(0, 0, canvas.width, canvas.height);

            if (resizeRegistrations.length > 0) {
                resizeRegistrations.forEach(registration => registration.callback());
            }
        }
    };
    update(true);
    
    const draw = () => {

        //Canvas can only be updated immediately before the draw step
        update();
    };

    return {
        type: CANVAS_TYPE_GLX,
        canvas,
        glx,
        getWidth,
        getHeight,
        setBackgroundColour,
        registerResizeEvent,
        actions: {
            draw
        }
    };
};

export default useCanvasGlx;