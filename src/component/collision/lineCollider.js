import colliderTypes from '../../engine/collision/collisionTypes';

export const useLineCollider = ({
    line
}) => {

    if (!line) throw new Error('line is not defined');

    const type = colliderTypes.line;

    const collider = {
        type,
        line
    };

    const contains = subject => colliderContains(collider, subject);
    const overlaps = subject => colliderOverlaps(collider, subject);

    return {
        ...collider,
        contains,
        overlaps
    };
};