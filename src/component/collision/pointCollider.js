import colliderTypes from './collisionTypes';

export const usePointCollider = ({
    position
}) => {

    if (!position) throw new Error('position is not defined');

    const type = colliderTypes.point;
    
    return {
        type,
        position
    };
};