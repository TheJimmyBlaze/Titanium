import colliderTypes from './collisionTypes';

export const useLineCollider = ({
    line
}) => {

    if (!line) throw new error('line is not defined');

    const type = colliderTypes.line;

    return {
        type,
        line
    };
};