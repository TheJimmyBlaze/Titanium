import collisionTypes from './collisionTypes';

export const useRectCollider = ({
    position,
    width,
    height
}) => {

    if (!position) throw new Error('position is not defined');
    if (!width || !height) throw new Error('cannot create a rect collider with a width or height of 0, use a line or point collider instead');

    const type = collisionTypes.rect;

    const state = {
        width,
        height
    };

    const getWidth = () => state.width;
    const setWidth = width => state.width = width;

    const getHeight = () => state.height;
    const setHeight = height => state.height = height;

    return {
        type,
        position,
        getWidth,
        setWidth,
        getHeight,
        setHeight
    };
};