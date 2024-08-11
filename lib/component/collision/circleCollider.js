import colliderTypes from '../../engine/collision/collisionTypes';
import { colliderContains } from '../../engine/collision/containCollision';
import { colliderOverlaps } from '../../engine/collision/overlapCollision';

export const useCircleCollider = ({
    position,
    radius,
    drawCamera = null
}) => {

    if (!position) throw new Error('position is not defined');
    if (!radius) throw new Error('cannot create a circle collider with a radius of 0, use a point collider instead');

    const type = colliderTypes.circle;

    const state = {
        radius
    };

    const getRadius = () => state.radius;
    const setRadius = radius => state.radius = radius;

    const collider = {
        type,
        position,
        getRadius,
        setRadius
    };

    const contains = subject => colliderContains(collider, subject);
    const overlaps = subject => colliderOverlaps({...collider, contains}, subject);

    const draw = () => {

        if (!drawCamera) return;

        drawCamera.requestDraw(
            ctx => {

                const {x, y} = position.getPosition();
                
                ctx.beginPath();
                ctx.moveTo(x + getRadius(), y);
                ctx.arc(
                    x,
                    y,
                    getRadius(),
                    0,
                    2 * Math.PI
                );
                ctx.closePath();
                ctx.stroke();
            },
            1000
        );
    };

    return {
        ...collider,
        contains,
        overlaps,
        actions: {
            draw
        }
    };
};