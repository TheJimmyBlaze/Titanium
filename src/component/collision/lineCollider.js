import colliderTypes from '../../engine/collision/collisionTypes';

export const useLineCollider = ({
    line,
    drawCamera = null
}) => {

    if (!line) throw new Error('line is not defined');

    const type = colliderTypes.line;

    const collider = {
        type,
        line
    };

    const contains = subject => colliderContains(collider, subject);
    const overlaps = subject => colliderOverlaps(collider, subject);

    const draw = () => {

        if (!drawCamera) return;

        drawCamera.requestDraw(
            ctx => {

                ctx.strokeStyle = ctx.fillStyle = 'lime';

                const start = line.getStartPosition().getPosition();
                const end = line.getEndPosition().getPosition();

                ctx.moveTo(
                    start.x,
                    start.y
                );
                ctx.lineTo(
                    end.x,
                    end.y
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