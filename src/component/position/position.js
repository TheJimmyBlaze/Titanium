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

    const clone = (parent = null) => usePosition(
        getPosition().x, 
        getPosition().y,
        parent
    );

    const move = (deltaX, deltaY) => {
        state.x += deltaX;
        state.y += deltaY;
    };

    const moveTo = (x, y) => {
        state.x = x;
        state.y = y;
    };
    
    const lerpTo = (x, y, smoothing) => {

        const {x: currentX, y: currentY} = getIsolatedPosition();

        const lerpX = lerp(currentX, x, smoothing);
        const lerpY = lerp(currentY, y, smoothing);

        moveTo(lerpX, lerpY);
    };

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

        const {x: parentX, y: parentY} = otherPosition.getPosition();
        const {x, y} = getPosition();

        const newX = (cos * (x - parentX)) - (sin * (y - parentY));
        const newY = (cos * (y - parentY)) + (sin * (x - parentX));
       
        moveTo(newX, newY);
    }

    return {
        getParent,
        setParent,
        getIsolatedPosition,
        getPosition,
        clone,
        move,
        moveTo,
        lerpTo,
        findDistance,
        rotateAroundPosition
    };
};