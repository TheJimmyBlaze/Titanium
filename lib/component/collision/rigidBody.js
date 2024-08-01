import { motionBody } from '../../engine/collision/motionBody';
import { resolveCollision } from '../../engine/collision/collisionResolver';

export const useRigidBody = ({
    obstructiveColliderComponent,
    position,
    motion,
    collider
}) => {
    
    const body = motionBody({
        obstructiveColliderComponent,
        position,
        motion,
        collider
    });

    const update = () => {

        const collisions = body.move();
        if (!collisions?.length) return;

        collisions.forEach(collision => {

            const {x: positionX, y: positionY} = position.getPosition();
            const {x: colliderX, y: colliderY} = collider.position.getPosition();

            const deltaX = positionX - colliderX;
            const deltaY = positionY - colliderY;

            const resolution = resolveCollision(collider, collision);
            const {x: resolveX, y: resolveY} = resolution.getPosition();

            position.moveTo(resolveX + deltaX, resolveY + deltaY);
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