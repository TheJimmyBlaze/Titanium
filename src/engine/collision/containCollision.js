import collisionTypes from './collisionTypes';

export const colliderContains = (a, b) => {
    
    let aType = a.type;
    let bType = b.type;

    if (aType === collisionTypes.point) {
        //Ensure bType is always a point if there are any
        [aType, bType] = [bType, aType];
    }
    if (aType === collisionTypes.rect) {

        if (bType === collisionTypes.point) {
            return rectContainPoint(a, b);
        }
        if (bType === collisionTypes.circle) {
            return rectContainCircle(a, b);
        }
        return rectContain(a, b);
    }
    if (aType === collisionTypes.circle) {

        if (bType === collisionTypes.point) {
            return circleContainPoint(a, b);
        }
        if (bType === collisionTypes.rect) {
            return circleContainRect(a, b);
        }
        return circleContain(a, b);
    }

    return false;
};

const rectContainPoint = (rect, point) => {

    const {x: rectX, y: rectY} = rect.position.getPosition();
    const width = rect.getWidth();
    const height = rect.getHeight();

    const {x: pointX, y: pointY} = point.position.getPosition();

    return (rectX - width / 2) <= pointX && pointX <= (rectX + width / 2) && 
        (rectY - height / 2) <= pointY && pointY <= (rectY + height / 2);
};

const rectContainCircle = (rect, circle) => {

    const {x: rectX, y: rectY} = rect.position.getPosition();
    const width = rect.getWidth();
    const height = rect.getHeight();

    const {x: circleX, y: circleY} = circle.position.getPosition();
    const radius = circle.getRadius();

    return (circleX - radius) >= (rectX - width / 2) ||
        (circleX + radius) <= (rectX + width / 2) ||
        (circleY - radius) >= (rectY - height / 2) ||
        (circleY + radius) <= (rectY + height / 2);
};

const rectContain = (a, b) => {

    const {x: aX, y: aY} = a.position.getPosition();
    const aWidth = a.getWidth();
    const aHeight = a.getHeight();

    const {x: bX, y: bY} = b.position.getPosition();
    const bWidth = b.getWidth();
    const bHeight = b.getHeight();

    return (aX - aWidth / 2) <= (bX - bWidth / 2) &&
        (aY - aHeight / 2) <= (bY - bHeight / 2) &&
        (aX + aWidth / 2) >= (bX + bWidth / 2) &&
        (aY + aHeight / 2) >= (bY + bHeight / 2);
};

const circleContainPoint = (circle, point) => {
    throw new Error('not implemented');
};

const circleContainRect = (circle, rect) => {
    throw new Error('not implemented');
};

const circleContain = (a, b) => {
    throw new Error('not implemented');
};