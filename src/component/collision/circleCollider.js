import colliderTypes from './collisionTypes';

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

    return {
        type,
        position,
        getRadius,
        setRadius
    };
};