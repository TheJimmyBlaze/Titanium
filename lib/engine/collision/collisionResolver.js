import collisionTypes from './collisionTypes';
import { clamp } from '../math';
import { usePosition } from '../../component/position/position';
import { useLine } from '../../component/position/line';
import { useLineCollider } from '../../component/collision/lineCollider';
import { usePointCollider } from '../../component/collision/pointCollider';

export const resolveCollision = (a, b) => {

    const aType = a.type;
    const bType = b.type;

    if (aType === collisionTypes.point) {
        if (bType === collisionTypes.point) return pointPointResolve(a, b);
        if (bType === collisionTypes.circle) return pointCircleResolve(a, b);
        if (bType === collisionTypes.line) return pointLineResolve(a, b);
        if (bType === collisionTypes.rect) return pointRectResolve(a, b);
    }

    if (aType === collisionTypes.line) {
        if (bType === collisionTypes.point) return pointLineResolve(b, a);
        if (bType === collisionTypes.line) return lineLineResolve(a, b);
        if (bType === collisionTypes.circle) return lineCircleResolve(a, b);
        if (bType === collisionTypes.rect) return lineRectResolve(a, b);
    }

    if (aType === collisionTypes.circle) {
        if (bType === collisionTypes.point) return pointCircleResolve(b, a);
        if (bType === collisionTypes.line) return lineCircleResolve(b, a);
        if (bType === collisionTypes.circle) return circleCircleResolve(a, b);
        if (bType === collisionTypes.rect) return circleRectResolve(a, b);
    }

    if (aType === collisionTypes.rect) {
        if (bType === collisionTypes.point) return pointRectResolve(b, a);
        if (bType === collisionTypes.line) return lineRectResolve(b, a);
        if (bType === collisionTypes.circle) return circleRectResolve(b, a);
        if (bType === collisionTypes.rect) return rectRectResolve(a, b);
    }

    const { x, y } = a.position.getPosition();
    return usePosition({ x, y });
};

const closestPointOnRectEdge = (bX, bY, bW, bH, pX, pY) => {

    const bLeft = bX - bW / 2;
    const bRight = bX + bW / 2;
    const bTop = bY - bH / 2;
    const bBottom = bY + bH / 2;

    const pxClamp = clamp(pX, bLeft, bRight);
    const pyClamp = clamp(pY, bTop, bBottom);

    const inside = pX >= bLeft && pX <= bRight && pY >= bTop && pY <= bBottom;
    if (!inside) return { x: pxClamp, y: pyClamp };

    const dTop = pY - bTop;
    const dBottom = bBottom - pY;
    const dLeft = pX - bLeft;
    const dRight = bRight - pX;
    const minD = Math.min(dTop, dBottom, dLeft, dRight);

    if (minD === dTop) return { x: pX, y: bTop };
    if (minD === dBottom) return { x: pX, y: bBottom };
    if (minD === dLeft) return { x: bLeft, y: pY };
    return { x: bRight, y: pY };
};

const closestPointOnCircleEdge = (cX, cY, radius, pX, pY) => {

    const dx = pX - cX;
    const dy = pY - cY;
    const d = Math.hypot(dx, dy);

    if (d <= 0) return { x: cX + radius, y: cY };
    return { x: cX + (dx / d) * radius, y: cY + (dy / d) * radius };
};

const findClosestPointOnCircle = (cX, cY, cR, pX, pY, pR) => {

    const vectorX = pX - cX;
    const vectorY = pY - cY;
    const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

    const totalRadius = pR + cR;
    const resolveX = cX + vectorX / magnitude * totalRadius;
    const resolveY = cY + vectorY / magnitude * totalRadius;

    return usePosition({ x: resolveX, y: resolveY });
};

const pointPointResolve = (a, b) => {

    if (a.type !== collisionTypes.point || b.type !== collisionTypes.point) {
        throw new Error(`pointPointResolve expects 'a' type: ${collisionTypes.point}, 'b' type: ${collisionTypes.point}`);
    }

    const { x, y } = b.position.getPosition();
    return usePosition({ x, y });
};

const pointCircleResolve = (a, b) => {

    if (a.type !== collisionTypes.point || b.type !== collisionTypes.circle) {
        throw new Error(`pointCircleResolve expects 'a' type: ${collisionTypes.point}, 'b' type: ${collisionTypes.circle}`);
    }

    const { x: pX, y: pY } = a.position.getPosition();
    const { x: cX, y: cY } = b.position.getPosition();
    const r = b.getRadius();
    const point = closestPointOnCircleEdge(cX, cY, r, pX, pY);
    return usePosition(point);
};

const pointRectResolve = (a, b) => {

    if (a.type !== collisionTypes.point || b.type !== collisionTypes.rect) {
        throw new Error(`pointRectResolve expects 'a' type: ${collisionTypes.point}, 'b' type: ${collisionTypes.rect}`);
    }

    const { x: pX, y: pY } = a.position.getPosition();
    const { x: bX, y: bY } = b.position.getPosition();
    const bW = b.getWidth();
    const bH = b.getHeight();
    const point = closestPointOnRectEdge(bX, bY, bW, bH, pX, pY);
    return usePosition(point);
};

const pointLineResolve = (a, b) => {

    if (a.type !== collisionTypes.point || b.type !== collisionTypes.line) {
        throw new Error(`pointLineResolve expects 'a' type: ${collisionTypes.point}, 'b' type: ${collisionTypes.line}`);
    }

    const closest = b.line.findClosestPositionOnLine(a.position);
    return closest;
};

const lineLineResolve = (a, b) => {

    if (a.type !== collisionTypes.line || b.type !== collisionTypes.line) {
        throw new Error(`lineLineResolve expects 'a' type: ${collisionTypes.line}, 'b' type: ${collisionTypes.line}`);
    }

    const { x: aX1, y: aY1 } = a.line.getStartPosition().getPosition();
    const { x: aX2, y: aY2 } = a.line.getEndPosition().getPosition();
    const { x: bX1, y: bY1 } = b.line.getStartPosition().getPosition();
    const { x: bX2, y: bY2 } = b.line.getEndPosition().getPosition();

    const determinate = (aX2 - aX1) * (bY2 - bY1) - (bX2 - bX1) * (aY2 - aY1);
    if (determinate === 0) {
        const midX = (bX1 + bX2) / 2;
        const midY = (bY1 + bY2) / 2;
        return usePosition({ x: midX, y: midY });
    }

    const lambda = ((bY2 - bY1) * (bX2 - aX1) + (bX1 - bX2) * (bY2 - aY1)) / determinate;
    const gamma = ((aY1 - aY2) * (bX2 - aX1) + (aX2 - aX1) * (bY2 - aY1)) / determinate;

    if (!(0 < lambda && lambda < 1) || !(0 < gamma && gamma < 1)) {
        const midX = (bX1 + bX2) / 2;
        const midY = (bY1 + bY2) / 2;
        return usePosition({ x: midX, y: midY });
    }

    return usePosition({ x: bX1 + gamma * (bX2 - bX1), y: bY1 + gamma * (bY2 - bY1) });
};

const lineRectResolve = (a, b) => {

    if (a.type !== collisionTypes.line || b.type !== collisionTypes.rect) {
        throw new Error(`lineRectResolve expects 'a' type: ${collisionTypes.line}, 'b' type: ${collisionTypes.rect}`);
    }

    const aStart = a.line.getStartPosition();
    const aEnd = a.line.getEndPosition();
    const { x: bX, y: bY } = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    const bLeft = bX - bWidth / 2;
    const bRight = bX + bWidth / 2;
    const bTop = bY - bHeight / 2;
    const bBottom = bY + bHeight / 2;

    if (b.contains(usePointCollider({ position: aStart })) || b.contains(usePointCollider({ position: aEnd }))) {
        const { x: sx, y: sy } = aStart.getPosition();
        const point = closestPointOnRectEdge(bX, bY, bWidth, bHeight, sx, sy);
        return usePosition(point);
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
    if (lineSegmentsIntersect(a, top)) return usePosition(rectPoint());

    const bottom = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bRight, y: bBottom }),
            endPosition: usePosition({ x: bLeft, y: bBottom })
        })
    });
    if (lineSegmentsIntersect(a, bottom)) return usePosition(rectPoint());

    const left = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bLeft, y: bBottom }),
            endPosition: usePosition({ x: bLeft, y: bTop })
        })
    });
    if (lineSegmentsIntersect(a, left)) return usePosition(rectPoint());

    const right = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bRight, y: bTop }),
            endPosition: usePosition({ x: bRight, y: bBottom })
        })
    });
    if (lineSegmentsIntersect(a, right)) return usePosition(rectPoint());

    return usePosition(rectPoint());
};

const lineSegmentsIntersect = (a, b) => {

    const { x: aX1, y: aY1 } = a.line.getStartPosition().getPosition();
    const { x: aX2, y: aY2 } = a.line.getEndPosition().getPosition();
    const { x: bX1, y: bY1 } = b.line.getStartPosition().getPosition();
    const { x: bX2, y: bY2 } = b.line.getEndPosition().getPosition();

    const determinate = (aX2 - aX1) * (bY2 - bY1) - (bX2 - bX1) * (aY2 - aY1);
    if (determinate === 0) return false;

    const lambda = ((bY2 - bY1) * (bX2 - aX1) + (bX1 - bX2) * (bY2 - aY1)) / determinate;
    const gamma = ((aY1 - aY2) * (bX2 - aX1) + (aX2 - aX1) * (bY2 - aY1)) / determinate;

    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
};

const lineCircleResolve = (a, b) => {

    if (a.type !== collisionTypes.line || b.type !== collisionTypes.circle) {
        throw new Error(`lineCircleResolve expects 'a' type: ${collisionTypes.line}, 'b' type: ${collisionTypes.circle}`);
    }

    const bPos = b.position;
    const bRadius = b.getRadius();
    const { x: bX, y: bY } = bPos.getPosition();
    const closestA = a.line.findClosestPositionOnLine(bPos);
    const { x: cx, y: cy } = closestA.getPosition();
    const point = closestPointOnCircleEdge(bX, bY, bRadius, cx, cy);
    return usePosition(point);
};

const circleCircleResolve = (a, b) => {

    if (a.type !== collisionTypes.circle || b.type !== collisionTypes.circle) {
        throw new Error(`circleCircleResolve expects 'a' type: ${collisionTypes.circle}, 'b' type: ${collisionTypes.circle}`);
    }

    const { position: aPos, radius: aRadius } = a;
    const { x: aX, y: aY } = aPos.getPosition();

    const { position: bPos, radius: bRadius } = b;
    const { x: bX, y: bY } = bPos.getPosition();

    return findClosestPointOnCircle(bX, bY, bRadius, aX, aY, aRadius);
};

const circleRectResolve = (a, b) => {

    if (a.type !== collisionTypes.circle || b.type !== collisionTypes.rect) {
        throw new Error(`circleRectResolve expects 'a' type: ${collisionTypes.circle}, 'b' type: ${collisionTypes.rect}`);
    }

    const circle = a;
    const rect = b;
    const { position: aPos } = circle;
    const { x: aX, y: aY } = aPos.getPosition();
    const aRadius = circle.getRadius();

    const { position: bPos } = rect;
    const { x: bX, y: bY } = bPos.getPosition();
    const bWidth = rect.getWidth();
    const bHeight = rect.getHeight();

    const left = bX - bWidth / 2;
    const right = bX + bWidth / 2;
    const top = bY - bHeight / 2;
    const bottom = bY + bHeight / 2;

    const extLeft = left - aRadius;
    const extRight = right + aRadius;
    const extTop = top - aRadius;
    const extBottom = bottom + aRadius;

    const cornerRadius = 0;

    const getCandidates = () => {

        if (aX <= left) {
            if (aY <= top) {
                return [findClosestPointOnCircle(left, top, cornerRadius, aX, aY, aRadius)];
            }
            if (aY >= bottom) {
                return [findClosestPointOnCircle(left, bottom, cornerRadius, aX, aY, aRadius)];
            }
        }
        if (aX >= right) {
            if (aY <= top) {
                return [findClosestPointOnCircle(right, top, cornerRadius, aX, aY, aRadius)];
            }
            if (aY >= bottom) {
                return [findClosestPointOnCircle(right, bottom, cornerRadius, aX, aY, aRadius)];
            }
        }

        return [
            useLine({
                startPosition: usePosition({ x: extLeft, y: extTop }),
                endPosition: usePosition({ x: extRight, y: extTop })
            }).findClosestPositionOnLine(aPos),
            useLine({
                startPosition: usePosition({ x: extRight, y: extTop }),
                endPosition: usePosition({ x: extRight, y: extBottom })
            }).findClosestPositionOnLine(aPos),
            useLine({
                startPosition: usePosition({ x: extLeft, y: extBottom }),
                endPosition: usePosition({ x: extRight, y: extBottom })
            }).findClosestPositionOnLine(aPos),
            useLine({
                startPosition: usePosition({ x: extLeft, y: extTop }),
                endPosition: usePosition({ x: extLeft, y: extBottom })
            }).findClosestPositionOnLine(aPos)
        ];
    };

    const candidates = getCandidates();
    if (candidates.length === 1) return candidates[0];

    const orderedSides = candidates.sort((candA, candB) => {

        const aDistance = candA.findDistance(aPos);
        const bDistance = candB.findDistance(aPos);

        if (aDistance <= bDistance) return -1;
        if (aDistance > bDistance) return 1;
    });
    return orderedSides[0];
};

const rectRectResolve = (a, b) => {

    if (a.type !== collisionTypes.rect || b.type !== collisionTypes.rect) {
        throw new Error(`rectRectResolve expects 'a' type: ${collisionTypes.rect}, 'b' type: ${collisionTypes.rect}`);
    }

    const { position: aPos } = a;
    const { x: x1, y: y1 } = aPos.getPosition();
    const w1 = a.getWidth();
    const h1 = a.getHeight();

    const { position: bPos } = b;
    const { x: x2, y: y2 } = bPos.getPosition();
    const w2 = b.getWidth();
    const h2 = b.getHeight();

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

