import { usePosition } from '../position/position';
import { useRectCollider } from '../collision/rectCollider';
import { clamp, lerp } from '../../engine/math';
import { CANVAS_TYPE_GLX } from './canvasGlx';

export const CAMERA_TYPE_GLX = "titanium.camera.glx";

export const useCameraGlx = ({
    canvas,
    position = usePosition(),
    minZoom = 1,
    maxZoom = 10,
    scale = 1,
    zoom = 0,
    smoothing = 0.0001
}) => {

    if (!canvas) throw new Error('canvas is not defined');
    
    if (canvas.type !== CANVAS_TYPE_GLX) throw new Error('cameraGlx requires canvasGlx');

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
        state.targetZoom = clamp(zoom, minZoom, maxZoom);
    };
    const incrementZoom = delta => {
        const newZoom = state.targetZoom + delta;
        state.targetZoom = clamp(newZoom, minZoom, maxZoom);
    };

    const getZoomScale = () => state.scale + state.zoom;

    const getWidth = () => canvas.getWidth() / getZoomScale();
    const getHeight = () => canvas.getHeight() / getZoomScale();

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

    const translatePositionBetweenCameras = (translationPosition, translationCamera) => {

        const {x, y} = translationPosition.getPosition();

        const {x: xFrom, y: yFrom} = position.getPosition();
        const zFrom = getZoomScale();

        const {x: xTo, y: yTo} = translationCamera.position.getPosition();
        const zTo = translationCamera.getZoomScale();

        const translateX = (x - xFrom) / zTo * zFrom + xTo;
        const translateY = (y - yFrom) / zTo * zFrom + yTo;

        return usePosition({x: translateX, y: translateY});
    };

    const shaders = {};
    const registerShader = (key, shader) => shaders[key] = shader;
    const getShader = key => shaders[key];

    const drawQueue = {};
    const requestDraw = (callback, zIndex = 0) => {
        (drawQueue[zIndex] ||= []).push(callback);
    };

    const commit = () => {

        //Camera can only be updated immediately before the draw step
        update();

        const drawOrder = Object.keys(drawQueue).sort((a, b) => a - b);
        drawOrder.forEach(zIndex => {

            const queue = drawQueue[zIndex];
            while (queue.length > 0) {

                queue[0]();
                queue.shift();
            }
        });
    };

    return {
        type: CAMERA_TYPE_GLX,
        canvas,
        position,
        collider,
        getScale,
        setScale,
        getZoom,
        setZoom,
        incrementZoom,
        getZoomScale,
        getWidth,
        getHeight,
        translatePositionBetweenCameras,
        setSmoothing,
        shaders,
        registerShader,
        getShader,
        requestDraw,
        actions: {
            commit
        }
    };
};