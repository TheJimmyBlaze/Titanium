import { lerp } from '../../engine/math';

export const usePosition = ({
    x = 0,
    y = 0,
    parent = null
}) => {

    const state = {
        x,
        y,
        parent
    };
    const setParent = parent => state.parent = parent;
    const getParent = () => state.parent;
    
    const getIsolatedPosition = () => ({
        x: state.x,
        y: state.y
    });

    const getPosition = () => {
        if (state.parent === null) return getIsolatedPosition();
        
        return {
            x: getParent().getPosition().x + state.x,
            y: getParent().getPosition().y + state.y
        };
    };

    const copy = () => usePosition(getPosition());
    const clone = () => usePosition({
        x: state.x, 
        y: state.y,
        parent
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
        const {x ,y} = position.getPosition();
        lerpTo(x, y, smoothing);
    }

    const findDistance = otherPosition => {

        const {x: aX, y: aY} = getPosition();
        const {x: bX, y: bY} = otherPosition.getPosition();
    
        const deltaX = aX - bX;
        const deltaY = aY - bY;
    
        return Math.hypot(deltaX, deltaY);
    };

    const rotateAroundPosition = (
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

    const rotateAroundParent = rotation => rotateAroundPosition(rotation, parent);

    const findAngleBetweenPosition = (
        otherPosition
    ) => {

        const {x, y} = getPosition();
        const {x: otherX, y: otherY} = otherPosition.getPosition();

        return Math.atan2(otherY - y, otherX - x) * 180 / Math.PI
    };

    return {
        getParent,
        setParent,
        getIsolatedPosition,
        getPosition,
        copy,
        clone,
        move,
        moveTo,
        moveToPosition,
        lerp: lerpBy,
        lerpTo,
        lerpToPosition,
        findDistance,
        rotateAroundPosition,
        rotateAroundParent,
        findAngleBetweenPosition
    };
};