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
        if (collidedType === collisionTypes.rect) {
            return rectRectResolve(collider, collided);
        }
        if (collidedType === collisionTypes.circle) {
            return rectCircleResolve(collider, collided);
        }
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

const rectRectResolve = (collider, collided) => {

    const { position: colliderPos } = collider;
    const { x: x1, y: y1 } = colliderPos.getPosition();
    const w1 = collider.getWidth();
    const h1 = collider.getHeight();

    const { position: collidedPos } = collided;
    const { x: x2, y: y2 } = collidedPos.getPosition();
    const w2 = collided.getWidth();
    const h2 = collided.getHeight();

    const left1 = x1 - w1 / 2;
    const right1 = x1 + w1 / 2;
    const top1 = y1 - h1 / 2;
    const bottom1 = y1 + h1 / 2;

    const left2 = x2 - w2 / 2;
    const right2 = x2 + w2 / 2;
    const top2 = y2 - h2 / 2;
    const bottom2 = y2 + h2 / 2;

    const overlapX = Math.min(right1, right2) - Math.max(left1, left2);
    const overlapY = Math.min(bottom1, bottom2) - Math.max(top1, top2);

    let resolveX = x1;
    let resolveY = y1;

    if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
            resolveX = x1 < x2 ? x1 - overlapX : x1 + overlapX;
        } else {
            resolveY = y1 < y2 ? y1 - overlapY : y1 + overlapY;
        }
    }

    return usePosition({ x: resolveX, y: resolveY });
};

const rectCircleResolve = (rect) => {
    const { x, y } = rect.position.getPosition();
    return usePosition({ x, y });
};