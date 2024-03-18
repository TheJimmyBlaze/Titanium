import collisionTypes from './collisionTypes';
import { usePosition } from '../../component/position/position';
import { useLineCollider } from '../../component/collision/lineCollider';
import { usePointCollider } from '../../component/collision/pointCollider';

export const colliderOverlaps = (a, b) => {

    const aType = a.type;
    const bType = b.type;

    if (aType === collisionTypes.point || bType === collisionTypes.point) {
        return a.contains(b);
    }
    if (aType === collisionTypes.line) {

        if (bType === collisionTypes.rect) {
            return lineRectOverlap(a, b);
        }
        if (bType === collisionTypes.circle) {
            return lineCircleOverlap(a, b);
        }
        return lineOverlap(a, b);
    }
    if (aType === collisionTypes.circle) {

        if (bType === collisionTypes.rect) {
            return circleRectOverlap(a, b);
        }
        if (bType === collisionTypes.line) {
            return lineCircleOverlap(b, a);
        }
        return circleOverlap(a, b);
    }
    if (aType === collisionTypes.rect) {

        if (bType === collisionTypes.circle) {
            return circleRectOverlap(b, a);
        }
        if (bType === collisionTypes.line) {
            return lineRectOverlap(b, a);
        }
        return rectOverlap(a, b);
    }

    return false;
};

const lineOverlap = (a, b) => {

    const {x: aX1, y: aY1} = a.line.getStartPosition().getPosition();
    const {x: aX2, y: aY2} = a.line.getEndPosition().getPosition();

    const {x: bX1, y: bY1} = b.line.getStartPosition().getPosition();
    const {x: bX2, y: bY2} = b.line.getEndPosition().getPosition();

    const determinate = (aX2 - aX1) * (bY2 - bY1) - (bX2 - bX1) * (aY2 - aY1);
    if (determinate === 0) return false;

    const lambda = ((bY2 - bY1) * (bX2 - aX1) + (bX1 - bX2) * (bY2 - aY1)) / determinate;
    const gamma = ((aY1 - aY2) * (bX2 - aX1) + (aX2 - aX1) * (bY2 - aY1)) / determinate;

    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
};

const lineCircleOverlap = (a, b) => {

    const bPos = circle.position;
    const bRadius = b.getRadius();

    //Finding the distance of line from center
    const closestA = a.findClosestPosition(bPos);
    const distance = bPos.findDistance(closestA); 
   
    return distance < bRadius;
};

const lineRectOverlap = (a, b) => {

    const aStart = a.line.getStartPosition();
    const aEnd = a.line.getEndPosition();

    if (b.contains(usePointCollider(aStart)) || b.contains(usePointCollider(aEnd))) return true;
    
    const {x: bX, y: bY} = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    const top = useLineCollider(usePosition(bX - bWidth / 2, bY - bHeight / 2), usePosition(bX + bWidth / 2, bY - bHeight / 2));
    if (lineOverlap(a, top)) return true;

    const bottom = useLineCollider(usePosition(bX + bWidth / 2, bY + bHeight / 2), usePosition(bX - bWidth / 2, bY + bHeight / 2));
    if (lineOverlap(a, bottom)) return true;

    const left = useLineCollider(usePosition(bX - bWidth / 2, bY + bHeight / 2), usePosition(bX - bWidth / 2, bY - bHeight / 2)); 
    if (lineOverlap(a, left)) return true;

    const right = useLineCollider(usePosition(bX + bWidth / 2, bY - bHeight / 2), usePosition(bX + bWidth / 2, bY + bHeight / 2));
    if (lineOverlap(a, right)) return true;

    return false;
};

const circleOverlap = (a, b) => {

    const {x: aX, y: aY} = a.position.getPosition();
    const aRadius = a.getRadius();

    const {x: bX, y: bY} = b.position.getPosition();
    const bRadius = b.getRadius();

    return Math.hypot(aX - bX, aY - bY) <= (aRadius + bRadius);
};

const rectOverlap = (a, b) => {
    
    const {x: aX, y: aY} = a.position.getPosition();
    const aWidth = a.getWidth();
    const aHeight = a.getHeight();

    const {x: bX, y: bY} = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    //No horizontal overlap
    if (
        (aX - aWidth / 2) >= (bX + bWidth / 2) || 
        (bX - bWidth / 2) >= (aX + aWidth / 2)
    ) return false;

    //No vertical overlap
    if (
        (aY - aHeight / 2) >= (bY + bHeight / 2) || 
        (bY - bHeight / 2) >= (aY + aHeight / 2)
    ) return false;

    return true;
};

const circleRectOverlap = (circle, rect) => {

    const {x: cX, y: cY} = circle.position.getPosition();
    const radius = circle.getRadius();

    const {x: rX, y: rY} = rect.position.getPosition();
    const width = rect.getWidth();
    const height = rect.getHeight();

    const distanceX = Math.abs(cX - rX);
    const distanceY = Math.abs(cY - rY);

    //Circle does not intersect rect
    if (distanceX > (width / 2 + radius)) return false;
    if (distanceY > (height / 2 + radius)) return false;

    //Circle intersect rect at the shortest distance
    if (distanceX <= (width / 2)) return true;
    if (distanceY <= (height / 2)) return true;

    //If circle intersects rect at the longest distance
    const cornerX = distanceX - width / 2;
    const cornerY = distanceY - height / 2;
    return (cornerX * cornerX + cornerY * cornerY) <= (radius * radius);
};
