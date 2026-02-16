import collisionTypes from './collisionTypes';
import { clamp } from '../math';
import { usePosition } from '../../component/position/position';
import { useLine } from '../../component/position/line';
import { useLineCollider } from '../../component/collision/lineCollider';
import { usePointCollider } from '../../component/collision/pointCollider';

const closestPointOnRectEdge = (bX, bY, bW, bH, pX, pY) => {

    const bLeft = bX - bW / 2, bRight = bX + bW / 2;
    const bTop = bY - bH / 2, bBottom = bY + bH / 2;

    const pxClamp = clamp(pX, bLeft, bRight);
    const pyClamp = clamp(pY, bTop, bBottom);

    const inside = pX >= bLeft && pX <= bRight && pY >= bTop && pY <= bBottom;
    if (!inside) return { x: pxClamp, y: pyClamp };

    const dTop = pY - bTop, dBottom = bBottom - pY, dLeft = pX - bLeft, dRight = bRight - pX;
    const minD = Math.min(dTop, dBottom, dLeft, dRight);

    if (minD === dTop) return { x: pX, y: bTop };
    if (minD === dBottom) return { x: pX, y: bBottom };
    if (minD === dLeft) return { x: bLeft, y: pY };
    return { x: bRight, y: pY };
};

const closestPointOnCircleEdge = (cX, cY, radius, pX, pY) => {
    
    const dx = pX - cX, dy = pY - cY;
    const d = Math.hypot(dx, dy);

    if (d <= 0) return { x: cX + radius, y: cY };
    return { x: cX + (dx / d) * radius, y: cY + (dy / d) * radius };
};

export const colliderOverlaps = (a, b) => {

    const aType = a.type;
    const bType = b.type;

    if (aType === collisionTypes.quadTree || bType === collisionTypes.quadTree) {

        if (aType === collisionTypes.quadTree && bType === collisionTypes.quadTree) {
            throw new Error('quadTree to quadTree collision is not supported');
        }

        const quadTree = aType === collisionTypes.quadTree ? a : b;
        const otherCollider = aType === collisionTypes.quadTree ? b : a;
        const candidates = quadTree.query(otherCollider);
        
        const results = [];
        for (const item of candidates) {
            const overlaps = colliderOverlaps(otherCollider, item.collider);
            results.push(...overlaps);
        }
        return results;
    }

    if (aType === collisionTypes.point || bType === collisionTypes.point) {

        if (!a.contains(b)) return [];
        
        const pointPos = (aType === collisionTypes.point ? a : b).position.getPosition();
        return [{ collider: b, point: { x: pointPos.x, y: pointPos.y } }];
    }

    if (aType === collisionTypes.line) {

        if (bType === collisionTypes.rect) {
            const point = lineRectOverlap(a, b);
            return point ? [{ collider: b, point }] : [];
        }
        if (bType === collisionTypes.circle) {
            const point = lineCircleOverlap(a, b);
            return point ? [{ collider: b, point }] : [];
        }

        const point = lineOverlap(a, b);
        return point ? [{ collider: b, point }] : [];
    }

    if (aType === collisionTypes.circle) {

        if (bType === collisionTypes.rect) {
            const point = circleRectOverlap(a, b);
            return point ? [{ collider: b, point }] : [];
        }
        if (bType === collisionTypes.line) {
            const point = lineCircleOverlap(b, a);
            return point ? [{ collider: b, point }] : [];
        }

        const point = circleOverlap(a, b);
        return point ? [{ collider: b, point }] : [];
    }

    if (aType === collisionTypes.rect) {

        if (bType === collisionTypes.circle) {
            const point = circleRectOverlap(b, a);
            return point ? [{ collider: b, point }] : [];
        }
        if (bType === collisionTypes.line) {
            const point = lineRectOverlap(b, a);
            return point ? [{ collider: b, point }] : [];
        }

        const point = rectOverlap(a, b);
        return point ? [{ collider: b, point }] : [];
    }

    return [];
};

const lineOverlap = (a, b) => {

    const { x: aX1, y: aY1 } = a.line.getStartPosition().getPosition();
    const { x: aX2, y: aY2 } = a.line.getEndPosition().getPosition();
    const { x: bX1, y: bY1 } = b.line.getStartPosition().getPosition();
    const { x: bX2, y: bY2 } = b.line.getEndPosition().getPosition();

    const determinate = (aX2 - aX1) * (bY2 - bY1) - (bX2 - bX1) * (aY2 - aY1);
    if (determinate === 0) return null;

    const lambda = ((bY2 - bY1) * (bX2 - aX1) + (bX1 - bX2) * (bY2 - aY1)) / determinate;
    const gamma = ((aY1 - aY2) * (bX2 - aX1) + (aX2 - aX1) * (bY2 - aY1)) / determinate;

    if (!(0 < lambda && lambda < 1) || !(0 < gamma && gamma < 1)) return null;

    return { x: bX1 + gamma * (bX2 - bX1), y: bY1 + gamma * (bY2 - bY1) };
};

const lineCircleOverlap = (a, b) => {

    const bPos = b.position;
    const bRadius = b.getRadius();

    const { x: bX, y: bY } = bPos.getPosition();
    const closestA = a.line.findClosestPositionOnLine(bPos);
    const { x: cx, y: cy } = closestA.getPosition();
    const distance = Math.hypot(bX - cx, bY - cy);

    if (distance >= bRadius) return null;
    return closestPointOnCircleEdge(bX, bY, bRadius, cx, cy);
};

const lineRectOverlap = (a, b) => {

    const aStart = a.line.getStartPosition();
    const aEnd = a.line.getEndPosition();
    const { x: bX, y: bY } = b.position.getPosition();
    
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    const bLeft = bX - bWidth / 2, bRight = bX + bWidth / 2;
    const bTop = bY - bHeight / 2, bBottom = bY + bHeight / 2;

    if (b.contains(usePointCollider({ position: aStart })) || b.contains(usePointCollider({ position: aEnd }))) {
        const { x: sx, y: sy } = aStart.getPosition();
        return closestPointOnRectEdge(bX, bY, bWidth, bHeight, sx, sy);
    }

    const midX = (aStart.getPosition().x + aEnd.getPosition().x) / 2;
    const midY = (aStart.getPosition().y + aEnd.getPosition().y) / 2;
    const rectPoint = () => closestPointOnRectEdge(bX, bY, bWidth, bHeight, midX, midY);

    const top = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bLeft, y: bTop }),
            endPosition: usePosition({ x: bRight, y: bTop })
        })
    });
    if (lineOverlap(a, top)) return rectPoint();

    const bottom = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bRight, y: bBottom }),
            endPosition: usePosition({ x: bLeft, y: bBottom })
        })
    });
    if (lineOverlap(a, bottom)) return rectPoint();

    const left = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bLeft, y: bBottom }),
            endPosition: usePosition({ x: bLeft, y: bTop })
        })
    });
    if (lineOverlap(a, left)) return rectPoint();

    const right = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bRight, y: bTop }),
            endPosition: usePosition({ x: bRight, y: bBottom })
        })
    });

    if (lineOverlap(a, right)) return rectPoint();
    return null;
};

const circleOverlap = (a, b) => {

    const { x: aX, y: aY } = a.position.getPosition();
    const aRadius = a.getRadius();
    const { x: bX, y: bY } = b.position.getPosition();
    const bRadius = b.getRadius();

    const overlapping = Math.hypot(aX - bX, aY - bY) <= (aRadius + bRadius);
    if (!overlapping) return null;
    return closestPointOnCircleEdge(bX, bY, bRadius, aX, aY);
};

const rectOverlap = (a, b) => {

    const { x: aX, y: aY } = a.position.getPosition();
    const aWidth = a.getWidth();
    const aHeight = a.getHeight();

    const { x: bX, y: bY } = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    const aLeft = aX - aWidth / 2, aRight = aX + aWidth / 2;
    const aTop = aY - aHeight / 2, aBottom = aY + aHeight / 2;
    const bLeft = bX - bWidth / 2, bRight = bX + bWidth / 2;
    const bTop = bY - bHeight / 2, bBottom = bY + bHeight / 2;

    if (aLeft >= bRight || aRight <= bLeft || aTop >= bBottom || aBottom <= bTop) return null;

    const overlapMidX = (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    const overlapMidY = (Math.max(aTop, bTop) + Math.min(aBottom, bBottom)) / 2;
    return closestPointOnRectEdge(bX, bY, bWidth, bHeight, overlapMidX, overlapMidY);
};

const circleRectOverlap = (circle, rect) => {

    const { x: cX, y: cY } = circle.position.getPosition();
    const radius = circle.getRadius();
    const { x: rX, y: rY } = rect.position.getPosition();

    const width = rect.getWidth();
    const height = rect.getHeight();

    const distanceX = Math.abs(cX - rX);
    const distanceY = Math.abs(cY - rY);

    if (distanceX > (width / 2 + radius)) return null;
    if (distanceY > (height / 2 + radius)) return null;

    if (distanceX <= (width / 2) || distanceY <= (height / 2)) return closestPointOnRectEdge(rX, rY, width, height, cX, cY);

    const cornerX = distanceX - width / 2;
    const cornerY = distanceY - height / 2;
    if ((cornerX * cornerX + cornerY * cornerY) > (radius * radius)) return null;
    return closestPointOnRectEdge(rX, rY, width, height, cX, cY);
};
