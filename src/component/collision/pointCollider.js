import colliderTypes from '../../engine/collision/collisionTypes';

export const usePointCollider = ({
    position
}) => {

    if (!position) throw new Error('position is not defined');

    const type = colliderTypes.point;
    
    const collider = {
        type,
        position
    };

    const contains = subject => colliderContains(collider, subject);
    const overlaps = subject => colliderOverlaps(collider, subject);

    return {
        ...collider,
        contains,
        overlaps
    };
};