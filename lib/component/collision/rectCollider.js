import collisionTypes from '../../engine/collision/collisionTypes';
import { colliderContains } from '../../engine/collision/containCollision';
import { colliderOverlaps } from '../../engine/collision/overlapCollision';

export const useRectCollider = ({
    position,
    width,
    height,
    drawCamera = null
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

    const collider = {
        type,
        position,
        getWidth,
        setWidth,
        getHeight,
        setHeight
    };

    const contains = subject => colliderContains(collider, subject);
    const overlaps = subject => colliderOverlaps({...collider, contains}, subject);

    const draw = () => {

        if (!drawCamera) return;

        drawCamera.requestDraw(
            ctx => {

                const {x, y} = position.getPosition();

                ctx.beginPath();
                ctx.rect(
                    x - getWidth() / 2,
                    y - getHeight() / 2,
                    getWidth(),
                    getHeight()
                );
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