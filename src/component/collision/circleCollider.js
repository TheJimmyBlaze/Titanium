import colliderTypes from './collisionTypes';
import { colliderContains } from './containCollision';
import { colliderOverlaps, overlapContains } from './overlapCollision';

export const useCircleCollider = ({
    position,
    radius
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
    const overlaps = subject => colliderOverlaps(collider, subject);

    return {
        ...collider,
        contains,
        overlaps
    };
};