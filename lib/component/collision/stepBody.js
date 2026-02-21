
import { motionBody } from '../../engine/collision/motionBody';
import { usePosition } from '../position/position';
import { resolveCollision } from '../../engine/collision/collisionResolver';
import collisionTypes from '../../engine/collision/collisionTypes';

export const useStepBody = ({
    obstructiveColliderComponents = [],
    position,
    motion,
    collider,
    lazySort
}) => {

    const body = motionBody({
        obstructiveColliderComponents,
        position,
        motion,
        collider,
        lazySort
    });

    let grounded = false;

    const update = () => {

        if (motion.getMotion().velocityY < 0) grounded = false;

        const collisions = body.move();

        if (!collisions?.length) {
            grounded = false;
            return;
        }

        let standingOnObstacle = false;

        collisions.forEach(obstacle => {

            const { x: positionX, y: positionY } = position.getPosition();
            const { x: colliderX, y: colliderY } = collider.position.getPosition();

            const deltaX = positionX - colliderX;
            const deltaY = positionY - colliderY;

            const colliderBottom = collider.position.getPosition().y + collider.getHeight() / 2;
            const obstacleTop = obstacle.position.getPosition().y - obstacle.getHeight() / 2;

            let resolution;
            if (
                collider.type == collisionTypes.rect && obstacle.type === collisionTypes.rect &&
                obstacle.step &&
                colliderBottom > obstacleTop && colliderBottom - obstacleTop <= 10
            ) {
                resolution = usePosition({ x: positionX, y: obstacleTop - collider.getHeight() / 2 });
            } else {
                resolution = resolveCollision(collider, obstacle);
            }

            const { x: resolveX, y: resolveY } = resolution.getPosition();

            position.moveTo(resolveX + deltaX, resolveY + deltaY);

            const resolvedOnX = Math.abs(resolveX - colliderX) > 0.1;
            const resolvedOnY = Math.abs(resolveY - colliderY) > 0.1;

            const resolvedBottom = resolveY + collider.getHeight() / 2;
            if (resolvedBottom <= obstacleTop + 4) standingOnObstacle = true;
            if (resolvedOnY && resolveY <= colliderY) grounded = true;
            
            let { velocityX, velocityY } = motion.getMotion();
            if (resolvedOnX) velocityX = 0;
            if (resolvedOnY) velocityY = 0;
            motion.setMotion(velocityX, velocityY);
        });

        if (!standingOnObstacle) grounded = false;
    };

    return {
        position,
        motion,
        collider,
        isGrounded: () => { return grounded; },
        actions: {
            update
        }
    };
};