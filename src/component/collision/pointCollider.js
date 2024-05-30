import colliderTypes from '../../engine/collision/collisionTypes';
import { colliderContains } from '../../engine/collision/containCollision';
import { colliderOverlaps } from '../../engine/collision/overlapCollision';

export const usePointCollider = ({
    position,
    drawCamera = null
}) => {

    if (!position) throw new Error('position is not defined');

    const type = colliderTypes.point;
    
    const collider = {
        type,
        position
    };

    const contains = subject => colliderContains(collider, subject);
    const overlaps = subject => colliderOverlaps(collider, subject);

    const draw = () => {

        if (!drawCamera) return;

        drawCamera.requestDraw(
            ctx => {

                const {x, y} = position.getPosition();
    
                ctx.beginPath();
                ctx.moveTo(
                    x - 1, 
                    y - 1
                );
                ctx.lineTo(
                    x + 1,
                    y + 1
                );
                ctx.moveTo(
                    x + 1,
                    y - 1
                );
                ctx.lineTo(
                    x - 1,
                    y + 1
                );
                ctx.closePath();
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