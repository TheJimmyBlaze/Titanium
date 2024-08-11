import colliderTypes from '../../engine/collision/collisionTypes';
import { colliderContains } from '../../engine/collision/containCollision';
import { colliderOverlaps } from '../../engine/collision/overlapCollision';

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
    const overlaps = subject => colliderOverlaps({...collider, contains}, subject);

    const draw = () => {

        if (!drawCamera) return;

        drawCamera.requestDraw(
            ctx => {

                const start = line.getStartPosition().getPosition();
                const end = line.getEndPosition().getPosition();

                ctx.beginPath();
                ctx.moveTo(
                    start.x,
                    start.y
                );
                ctx.lineTo(
                    end.x,
                    end.y
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