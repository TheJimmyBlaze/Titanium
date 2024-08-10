import { usePosition } from '../position/position';
import { useRectCollider } from '../collision/rectCollider';
import { lerp } from '../../engine/math';

export const useCamera = ({
    canvas,
    position = usePosition(),
    minZoom = 1,
    maxZoom = 10,
    scale = 1,
    zoom = 0,
    smoothing = 0.0001
}) => {

    if (!canvas) throw new Error('canvas is not defined');

    const collider = useRectCollider({
        position,
        width: canvas.getWidth(),
        height: canvas.getHeight()
    });

    const state = {
        scale: scale,
        targetScale: scale,
        zoom: zoom,
        targetZoom: zoom,
        smoothing: smoothing
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

    const update = () => {

        collider.setWidth(canvas.getWidth());
        collider.setHeight(canvas.getHeight());

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

    const getAbsolutePosition = relative => {
        
        const width = collider.getWidth();
        const height = collider.getHeight();
        const {x: relativeX, y: relativeY} = position.getPosition();

        const followX = relativeX - width / 2 / getZoomScale();
        const followY = relativeY - height / 2 / getZoomScale();

        const absolute = relative.copy();
        absolute.move(-followX, -followY);

        const {x, y} = absolute.getPosition();
        absolute.moveTo(x * getZoomScale(), y * getZoomScale());

        return absolute;
    };

    const getRelativePosition = absolute => {

        const relative = absolute.copy();

        const {x, y} = relative.getPosition();
        relative.moveTo(x / getZoomScale(), y / getZoomScale());

        return relative;
    };

    const applyTranslation = ctx => {

        const {x, y} = position.getPosition();
        if (!(x === y === 0)) {

            const width = collider.getWidth();
            const height = collider.getHeight();

            const followX = x * getZoomScale() - width / 2;
            const followY = y * getZoomScale() - height / 2;

            ctx.translate(-followX, -followY);
        }
        if (getZoomScale() !== 1) {
            ctx.scale(getZoomScale(), getZoomScale());
        }
    };

    const drawQueue = {};
    const requestDraw = (callback, zIndex = 0) => {
        (drawQueue[zIndex] ||= []).push(callback);
    };

    const commit = () => {

        //Camera can only be updated immediately before the draw step
        update();

        const ctx = canvas.ctx;
        ctx.beginPath();

        ctx.moveTo(0, 0);

        applyTranslation(ctx);

        const drawOrder = Object.keys(drawQueue).sort((a, b) => a - b);
        drawOrder.forEach(zIndex => {

            const queue = drawQueue[zIndex];
            while (queue.length > 0) {

                queue[0](ctx);
                queue.shift();
            }
        });

        ctx.stroke();
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
        getAbsolutePosition,
        getRelativePosition,
        requestDraw,
        actions: {
            commit
        }
    };
};