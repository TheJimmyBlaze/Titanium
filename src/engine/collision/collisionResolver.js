import collisionTypes from './collisionTypes';
import { usePosition } from '../../component/position/position';
import { useLineCollider } from '../../component/collision/lineCollider';

export const resolveCollision = (collider, collided) => {

    const colliderType = collider.getState().type;
    const collidedType = collided.getState().type;

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

    return collider.getState().position.getPosition();
};

const findClosestPointOnCircle = (cX, cY, cR, pX, pY, pR) => {

    const vectorX = pX - cX;
    const vectorY = pY - cY;
    const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    const totalRadius = pR + cR;
    const resolveX = cX + vectorX / magnitude * totalRadius;
    const resolveY = cY + vectorY / magnitude * totalRadius;

    return usePosition(resolveX, resolveY);
}

const circleResolve = (collider, collided) => {

    const {position: colliderPos, radius: colliderRadius} = collider.getState();
    const {x: colliderX, y: colliderY} = colliderPos.getPosition();

    const {position: collidedPos, radius: collidedRadius} = collided.getState();
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

    const {position: circlePos, radius: circleRadius} = circle.getState();
    const {x: circleX, y: circleY} = circlePos.getPosition();

    const {position: rectPos, width: rectWidth, height: rectHeight} = rect.getState();
    const {x: rectX, y: rectY} = rectPos.getPosition();

    const left = rectX - rectWidth / 2;
    const right = rectX + rectWidth / 2;
    const top = rectY - rectHeight / 2;
    const bottom = rectY + rectHeight / 2

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
            useLineCollider(usePosition(extLeft, extTop), usePosition(extRight, extTop)).findClosestPosition(circlePos),
            useLineCollider(usePosition(extRight, extTop), usePosition(extRight, extBottom)).findClosestPosition(circlePos),
            useLineCollider(usePosition(extLeft, extBottom), usePosition(extRight, extBottom)).findClosestPosition(circlePos),
            useLineCollider(usePosition(extLeft, extTop), usePosition(extLeft, extBottom)).findClosestPosition(circlePos)
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