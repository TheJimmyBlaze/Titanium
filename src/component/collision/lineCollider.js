import colliderTypes from './collisionTypes';

export const useLineCollider = ({
    line
}) => {

    if (!line) throw new Error('line is not defined');

    const type = colliderTypes.line;

    return {
        type,
        line
    };
};