import { motionBody } from '../../engine/collision/motionBody';
import { resolveCollision } from '../../engine/collision/collisionResolver';

export const useRigidBody = ({
    obstructiveColliderComponent,
    position,
    motion,
    collider,
    lazySort
}) => {

    const body = motionBody({
        obstructiveColliderComponent,
        position,
        motion,
        collider,
        lazySort
    });

    const update = () => {

        const collisions = body.move();
        if (!collisions?.length) return;

        collisions.forEach(obstacle => {
            
            const { x: positionX, y: positionY } = position.getPosition();
            const { x: colliderX, y: colliderY } = collider.position.getPosition();

            const deltaX = positionX - colliderX;
            const deltaY = positionY - colliderY;

            const resolution = resolveCollision(collider, obstacle);
            const { x: resolveX, y: resolveY } = resolution.getPosition();

            position.moveTo(resolveX + deltaX, resolveY + deltaY);

            const resolvedOnX = Math.abs(resolveX - colliderX) > 0.001;
            const resolvedOnY = Math.abs(resolveY - colliderY) > 0.001;
            let { velocityX, velocityY } = motion.getMotion();
            if (resolvedOnX) velocityX = 0;
            if (resolvedOnY) velocityY = 0;
            motion.setMotion(velocityX, velocityY);
        });
    };

    return {
        position,
        motion,
        collider,
        actions: {
            update
        }
    };
};