import { usePosition } from '../position/position';
import { useRectCollider } from '../collision/rectCollider';
import { lerp } from '../../engine/math';
import { CANVAS_TYPE_GLX } from './canvasGlx';
import { useFrameShader } from '../../engine/graphics/frameShader';

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
        state.targetZoom = Math.min(maxZoom, Math.max(minZoom, zoom));
    };
    const incrementZoom = delta => {
        const newZoom = state.targetZoom + delta;
        state.targetZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
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

    const drawQueue = [];
    const requestDraw = callback => {
        drawQueue.push(callback);
    };

    const commit = () => {

        //Camera can only be updated immediately before the draw step
        update();

        while (drawQueue.length > 0) {

            drawQueue[0]();
            drawQueue.shift();
        }
    };

    const camera = {
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
        requestDraw,
        actions: {
            commit
        }
    };
    
    const shaders = {
        frameShader: useFrameShader({
            drawCamera: camera
        })
    };

    return {
        ...camera,
        shaders
    };
};