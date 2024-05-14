import collisionTypes from './collisionTypes';
import { usePosition } from '../../component/position/position';
import { useLine } from '../../component/position/line';

export const resolveCollision = (collider, collided) => {

    const colliderType = collider.type;
    const collidedType = collided.type;

    if (colliderType === collisionTypes.circle) {

        if (collidedType === collisionTypes.circle) {
            return circleResolve(collider, collided);
        }
        if (collidedType === collisionTypes.rect) {
            return circleRectResolve(collider, collided);
        }
    }
    if (colliderType === collisionTypes.rect) {
        throw new Error('not implemented');
    }

    return collider.position.getPosition();
};

const findClosestPointOnCircle = (cX, cY, cR, pX, pY, pR) => {

    const vectorX = pX - cX;
    const vectorY = pY - cY;
    const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    const totalRadius = pR + cR;
    const resolveX = cX + vectorX / magnitude * totalRadius;
    const resolveY = cY + vectorY / magnitude * totalRadius;

    return usePosition({x: resolveX, y: resolveY});
}

const circleResolve = (collider, collided) => {

    const {position: colliderPos, radius: colliderRadius} = collider;
    const {x: colliderX, y: colliderY} = colliderPos.getPosition();

    const {position: collidedPos, radius: collidedRadius} = collided;
    const {x: collidedX, y: collidedY} = collidedPos.getPosition();

    return findClosestPointOnCircle(
        collidedX,
        collidedY,
        collidedRadius,
        colliderX, 
        colliderY, 
        colliderRadius
    );
};

const circleRectResolve = (circle, rect) => {

    const {position: circlePos} = circle;
    const {x: circleX, y: circleY} = circlePos.getPosition();
    const circleRadius = circle.getRadius();

    const {position: rectPos} = rect;
    const {x: rectX, y: rectY} = rectPos.getPosition();
    const rectWidth = rect.getWidth();
    const rectHeight = rect.getHeight();

    const left = rectX - rectWidth / 2;
    const right = rectX + rectWidth / 2;
    const top = rectY - rectHeight / 2;
    const bottom = rectY + rectHeight / 2;

    const extLeft = left - circleRadius;
    const extRight = right + circleRadius;
    const extTop = top - circleRadius;
    const extBottom = bottom + circleRadius;

    const cornerRadius = 0;

    const getCandidates = () => {

        if (circleX <= left) {
            if (circleY <= top) {
                return [findClosestPointOnCircle(left, top, cornerRadius, circleX, circleY, circleRadius)]
            }
            if (circleY >= bottom) {
                return [findClosestPointOnCircle(left, bottom, cornerRadius, circleX, circleY, circleRadius)]
            }
        } 
        if (circleX >= right) {
            if (circleY <= top) {
                return [findClosestPointOnCircle(right, top, cornerRadius, circleX, circleY, circleRadius)]
            }
            if (circleY >= bottom) {
                return [findClosestPointOnCircle(right, bottom, cornerRadius, circleX, circleY, circleRadius)]
            }
        }

        return [
            useLine({
                startPosition: usePosition({x: extLeft, y: extTop}), 
                endPosition: usePosition({x: extRight, y: extTop})
            }).findClosestPositionOnLine(circlePos),
            useLine({
                startPosition: usePosition({x: extRight, y: extTop}), 
                endPosition: usePosition({x: extRight, y: extBottom})
            }).findClosestPositionOnLine(circlePos),
            useLine({
                startPosition: usePosition({x: extLeft, y: extBottom}), 
                endPosition: usePosition({x: extRight, y: extBottom})
            }).findClosestPositionOnLine(circlePos),
            useLine({
                startPosition: usePosition({x: extLeft, y: extTop}), 
                endPosition: usePosition({x: extLeft, y: extBottom})
            }).findClosestPositionOnLine(circlePos)
        ];
    };

    //Find closest side
    const candidates = getCandidates();
    if (candidates.length === 1) return candidates[0];
    
    const orderedSides = candidates.sort((a, b) => {
        
        const aDistance = a.findDistance(circlePos);
        const bDistance = b.findDistance(circlePos);

        if (aDistance <= bDistance) return -1;
        if (aDistance > bDistance) return 1;
    });
    return orderedSides[0];
};