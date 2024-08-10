import { usePosition } from '../../component/position/position';

export const useMousePosition = () => {

    const position = usePosition();

    const state = {
        lockedCamera: null
    };

    const isLocked = () => !!state.lockedCamera;

    const lock = camera => {

        state.lockedCamera = camera;
        const { canvas } = camera.canvas;
        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }
    };
    
    const unlock = () => {
        state.lockedCamera = null;
        document.exitPointerLock();
    };

    const mouseMove = e => {

        if (document.pointerLockElement) {
            
            const {movementX: x, movementY: y} = e;
            position.move(x, y);

            clampLockedPosition();
            return;
        }

        const {pageX: x, pageY: y} = e;
        position.moveTo(x, y);
    };
    document.addEventListener('mousemove', mouseMove);

    const clampLockedPosition = () => {

        if (state.lockedCamera === null) return;

        const width = state.lockedCamera.canvas.getWidth();
        const height = state.lockedCamera.canvas.getHeight();

        const {x, y} = position.getPosition();
        position.moveTo(
            Math.min(width, Math.max(0, x)),
            Math.min(height, Math.max(0, y))
        );
    };

    const getRelativePosition = camera => {

        if (camera == null) return position;

        const {position: camPos, canvas: camCanvas} = camera;
        const {x: camX, y: camY} = camPos.getPosition();

        const camWidth = camCanvas.getWidth();
        const camHeight = camCanvas.getHeight();
        
        const screenX = window.innerWidth / 2;
        const screenY = window.innerHeight / 2;

        const letterboxWidth = screenX - camWidth / 2;
        const letterboxHeight = screenY - camHeight / 2;

        const {x: mouseX, y: mouseY} = position.getPosition();
        const canvasMouseX = mouseX - letterboxWidth;
        const canvasMouseY = mouseY - letterboxHeight;

        const relativeX = camX + (canvasMouseX - camWidth / 2) / camera.getZoomScale();
        const relativeY = camY + (canvasMouseY - camHeight / 2) / camera.getZoomScale();

        return usePosition({x: relativeX, y: relativeY});
    };

    return {
        isLocked,
        lock,
        unlock,
        getRelativePosition
    };
};