import { usePosition } from '../component/position';
import { useRectCollider } from '../component/collider/rectCollider';
import { lerp } from '../engine/math';

export const Camera = ({
    canvas,
    minZoom = 1,
    maxZoom = 10,
    scale = 1,
    zoom = 0,
    smoothing = 0.0001,
    focusPosition = null
}) => {

    if (!canvas) throw new error('canvas is not defined');

    const getWidth = () => canvas.getWidth();
    const getHeight = () => canvas.getHeight();

    const position = usePosition({});
    const collider = useRectCollider({
        position,
        width: getWidth(),
        height: getHeight()
    });

    const state = {
        scale: scale,
        targetScale: scale,
        zoom: zoom,
        targetZoom: zoom,
        smoothing: smoothing,
        focus: focusPosition
    };

    const getScale = () => state.targetScale;
    const setScale = scale => state.targetScale = scale;

    const getZoom = () => state.targetZoom;
    const setZoom = zoom => {
        state.targetZoom = Math.min(maxZoom, Math.max(minZoom, zoom));
    };
    const incrementZoom = delta => {
        const newZoom = state.targetZoom + delta;
        state.targetZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
    };

    const getZoomScale = () => state.scale + state.zoom;

    const setSmoothing = smoothing => state.smoothing = smoothing;

    const getFocus = () => state.focus || usePosition({});
    const setFocus = focus => state.focus = focus;

    const update = () => {

        collider.setWidth(getWidth());
        collider.setHeight(getHeight());

        const {x: focusX, y: focusY} = getFocus().getPosition();
        position.moveTo(focusX, focusY);

        if (Math.abs(state.targetScale - state.scale) > 0.01) {
            state.scale = lerp(
                state.scale,
                state.targetScale,
                state.smoothing
            );
        }

        if (Math.abs(state.targetZoom - state.zoom) > 0.01) {
            state.zoom = lerp(
                state.zoom, 
                state.targetZoom, 
                state.smoothing
            );
        }
    };

    const drawQueue = [];
    const requestDraw = callback => {
        drawQueue.push(callback);
    };

    const getAbsolutePosition = relative => {
        
        const width = collider.getWidth();
        const height = collider.getHeight();
        const {x: relativeX, y: relativeY} = position.getPosition();

        const followX = relativeX - width / 2 / getZoomScale();
        const followY = relativeY - height / 2 / getZoomScale();

        const absolute = relative.clone();
        absolute.move(-followX, -followY);

        const {x, y} = absolute.getPosition();
        absolute.moveTo(x * getZoomScale(), y * getZoomScale());

        return absolute;
    };

    const getRelativePosition = absolute => {

        const relative = absolute.clone();

        const {x, y} = relative.getPosition();
        relative.moveTo(x / getZoomScale(), y / getZoomScale());

        return relative;
    };

    const applyTranslation = ctx => {

        if (state.focus) {

            const width = collider.getWidth();
            const height = collider.getHeight();
            const {x, y} = position.getPosition();

            const followX = x * getZoomScale() - width / 2;
            const followY = y * getZoomScale() - height / 2;

            ctx.translate(-followX, -followY);
        }
        if (getZoomScale() !== 1) {
            ctx.scale(getZoomScale(), getZoomScale());
        }
    };

    const draw = () => {

        //Camera can only be updated immediately before the draw step
        update();

        const ctx = canvas.ctx;
        ctx.beginPath();

        ctx.moveTo(0, 0);

        applyTranslation(ctx);

        while (drawQueue.length > 0) {

            drawQueue[0](ctx);
            drawQueue.shift();
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    return {
        canvas,
        position,
        collider,
        getScale,
        setScale,
        getZoom,
        setZoom,
        incrementZoom,
        getZoomScale,
        setSmoothing,
        setFocus,
        getFocus,
        getAbsolutePosition,
        getRelativePosition,
        requestDraw,

        draw
    };
};