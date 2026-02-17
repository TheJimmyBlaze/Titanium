import collisionTypes from './collisionTypes';
import { usePosition } from '../../component/position/position';
import { useLine } from '../../component/position/line';
import { useLineCollider } from '../../component/collision/lineCollider';
import { usePointCollider } from '../../component/collision/pointCollider';

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
        return [b];
    }

    if (aType === collisionTypes.line) {

        if (bType === collisionTypes.rect && lineRectOverlap(a, b)) return [b];
        if (bType === collisionTypes.circle && lineCircleOverlap(a, b)) return [b];
        if (bType === collisionTypes.line && lineOverlap(a, b)) return [b];
    }

    if (aType === collisionTypes.circle) {

        if (bType === collisionTypes.rect && circleRectOverlap(a, b)) return [b];
        if (bType === collisionTypes.line && lineCircleOverlap(b, a)) return [b];
        if (bType === collisionTypes.circle && circleOverlap(a, b)) return [b];
    }

    if (aType === collisionTypes.rect) {

        if (bType === collisionTypes.circle && circleRectOverlap(b, a)) return [b];
        if (bType === collisionTypes.line && lineRectOverlap(b, a)) return [b];
        if (bType === collisionTypes.rect && rectOverlap(a, b)) return [b];
    }

    return [];
};

const lineOverlap = (a, b) => {

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

const lineCircleOverlap = (a, b) => {

    const bPos = b.position;
    const bRadius = b.getRadius();
    const { x: bX, y: bY } = bPos.getPosition();
    const closestA = a.line.findClosestPositionOnLine(bPos);
    const { x: cx, y: cy } = closestA.getPosition();
    const distance = Math.hypot(bX - cx, bY - cy);

    return distance < bRadius;
};

const lineRectOverlap = (a, b) => {

    const aStart = a.line.getStartPosition();
    const aEnd = a.line.getEndPosition();
    const { x: bX, y: bY } = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    const bLeft = bX - bWidth / 2;
    const bRight = bX + bWidth / 2;
    const bTop = bY - bHeight / 2;
    const bBottom = bY + bHeight / 2;

    if (b.contains(usePointCollider({ position: aStart })) || b.contains(usePointCollider({ position: aEnd }))) return true;

    const top = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bLeft, y: bTop }),
            endPosition: usePosition({ x: bRight, y: bTop })
        })
    });
    if (lineOverlap(a, top)) return true;

    const bottom = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bRight, y: bBottom }),
            endPosition: usePosition({ x: bLeft, y: bBottom })
        })
    });
    if (lineOverlap(a, bottom)) return true;

    const left = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bLeft, y: bBottom }),
            endPosition: usePosition({ x: bLeft, y: bTop })
        })
    });
    if (lineOverlap(a, left)) return true;

    const right = useLineCollider({
        line: useLine({
            startPosition: usePosition({ x: bRight, y: bTop }),
            endPosition: usePosition({ x: bRight, y: bBottom })
        })
    });
    return lineOverlap(a, right);
};

const circleOverlap = (a, b) => {

    const { x: aX, y: aY } = a.position.getPosition();
    const aRadius = a.getRadius();
    const { x: bX, y: bY } = b.position.getPosition();
    const bRadius = b.getRadius();

    return Math.hypot(aX - bX, aY - bY) <= (aRadius + bRadius);
};

const rectOverlap = (a, b) => {

    const { x: aX, y: aY } = a.position.getPosition();
    const aWidth = a.getWidth();
    const aHeight = a.getHeight();
    const { x: bX, y: bY } = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    const aLeft = aX - aWidth / 2;
    const aRight = aX + aWidth / 2;
    const aTop = aY - aHeight / 2;
    const aBottom = aY + aHeight / 2;
    const bLeft = bX - bWidth / 2;
    const bRight = bX + bWidth / 2;
    const bTop = bY - bHeight / 2;
    const bBottom = bY + bHeight / 2;

    return !(aLeft >= bRight || aRight <= bLeft || aTop >= bBottom || aBottom <= bTop);
};

const circleRectOverlap = (circle, rect) => {

    const { x: cX, y: cY } = circle.position.getPosition();
    const radius = circle.getRadius();
    const { x: rX, y: rY } = rect.position.getPosition();
    const width = rect.getWidth();
    const height = rect.getHeight();

    const distanceX = Math.abs(cX - rX);
    const distanceY = Math.abs(cY - rY);

    if (distanceX > (width / 2 + radius)) return false;
    if (distanceY > (height / 2 + radius)) return false;
    if (distanceX <= (width / 2) || distanceY <= (height / 2)) return true;

    const cornerX = distanceX - width / 2;
    const cornerY = distanceY - height / 2;
    return (cornerX * cornerX + cornerY * cornerY) <= (radius * radius);
};
