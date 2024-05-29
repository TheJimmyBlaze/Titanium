import collisionTypes from '../../engine/collision/collisionTypes';

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
    const overlaps = subject => colliderOverlaps(collider, subject);

    const draw = () => {

        if (!drawCamera) return;

        drawCamera.requestDraw(
            ctx => {

                ctx.strokeStyle = ctx.fillStyle = 'lime';

                const {x, y} = position.getPosition();
                ctx.rect(
                    x - width / 2,
                    y - height / 2,
                    width,
                    height
                );
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