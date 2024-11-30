import { lerp } from '../../engine/math';

export const usePosition = ({
    x = 0,
    y = 0,
    rotation = 0,
    parent = null
} = {}) => {

    const state = {
        x,
        y,
        rotation,
        parent
    };

    const pack = () => ({
        x: Math.floor(state.x), 
        y: Math.floor(state.y),
        rotation: state.rotation,
    });
    const unpack = ({x, y, rotation}) => {
        state.x = x;
        state.y = y;
        state.rotation = rotation
    };
    
    const getIsolatedPosition = () => ({
        x: state.x,
        y: state.y,
        rotation: state.rotation
    });

    const getPosition = () => {
        if (state.parent === null) return getIsolatedPosition();
        
        const {x, y, rotation} = getParent().getPosition();
        return {
            x: x + state.x,
            y: y + state.y,
            rotation: rotation + state.rotation
        };
    };

    const copy = (args = {}) => usePosition({
        ...getPosition(),
        ...args,
    });

    const clone = (args = {}) => usePosition({
        ...state,
        ...args
    });

    const move = (deltaX, deltaY) => {
        state.x += deltaX;
        state.y += deltaY;
    };

    const moveTo = (x, y) => {
        state.x = x;
        state.y = y;
    };

    const moveToPosition = position => {
        const {x ,y} = position.getPosition();
        moveTo(x, y);
    }

    const lerpBy = (deltaX, deltaY, smoothing) => {

        const {x: currentX, y: currentY} = getIsolatedPosition();
        
        const lerpX = lerp(currentX, currentX + deltaX, smoothing);
        const lerpY = lerp(currentY, currentY + deltaY, smoothing);

        moveTo(lerpX, lerpY);
    }
    
    const lerpTo = (x, y, smoothing) => {

        const {x: currentX, y: currentY} = getIsolatedPosition();

        const lerpX = lerp(currentX, x, smoothing);
        const lerpY = lerp(currentY, y, smoothing);

        moveTo(lerpX, lerpY);
    };

    const lerpToPosition = (position, smoothing) => {
        const {x, y} = position.getPosition();
        lerpTo(x, y, smoothing);
    };

    const getRotation = () => state.rotation;
    
    const rotate = delta => state.rotation += delta;
    const rotateTo = rotation => state.rotation = rotation;

    const lerpRotate = (delta, smoothing) => {

        const newRotation = state.rotation + delta;
        const lerpRotation = lerp(state.rotation, newRotation, smoothing);
        rotateTo(lerpRotation);
    };

    const lerpRotateTo = (rotation, smoothing) => {
        
        const lerpRotation = lerp(state.rotation, rotation, smoothing);
        rotateTo(lerpRotation);
    };

    const getParent = () => state.parent;
    const setParent = parent => state.parent = parent;

    const findDistance = otherPosition => {

        const {x: aX, y: aY} = getPosition();
        const {x: bX, y: bY} = otherPosition.getPosition();
    
        const deltaX = aX - bX;
        const deltaY = aY - bY;
    
        return Math.hypot(deltaX, deltaY);
    };

    const translateAroundPosition = (
        rotation,
        otherPosition
    ) => {

        const radians = (Math.PI / 180) * rotation;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const {x, y} = getPosition();
        const {x: otherX, y: otherY} = otherPosition.getPosition();

        const newX = (cos * (x - otherX)) - (sin * (y - otherY));
        const newY = (cos * (y - otherY)) + (sin * (x - otherX));
       
        moveTo(newX, newY);
    };

    const translateAroundParent = rotation => translateAroundPosition(rotation, state.parent);

    const findAngleBetweenPosition = otherPosition => {

        const {x, y} = getPosition();
        const {x: otherX, y: otherY} = otherPosition.getPosition();

        return Math.atan2(otherY - y, otherX - x) * 180 / Math.PI
    };

    return {
        pack,
        unpack,
        getIsolatedPosition,
        getPosition,
        copy,
        clone,
        move,
        moveTo,
        moveToPosition,
        lerpBy,
        lerpTo,
        lerpToPosition,
        getRotation,
        rotate,
        rotateTo,
        lerpRotate,
        lerpRotateTo,
        getParent,
        setParent,
        findDistance,
        translateAroundPosition,
        translateAroundParent,
        findAngleBetweenPosition
    };
};