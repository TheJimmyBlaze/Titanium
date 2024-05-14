import { registry } from '../../engine/game';
import { resolveCollision } from '../../engine/collision/collisionResolver';

export const useRigidBody = ({
    obstructiveColliderComponent,
    position,
    motion,
    collider
}) => {

    if (!obstructiveColliderComponent) throw new error('obstructiveColliderComponent is not defined');
    if (!position) throw new Error('position is not defined');
    if (!motion) throw new Error('motion is not defined');
    if (!collider) throw new Error('collider is not defined');

    const update = () => {

        motion.apply(position);

        //Check collision
        const colliders = registry.getComponentsByName(obstructiveColliderComponent);

        const collisions = colliders?.filter(candidate => collider.overlaps(candidate));
        if (collisions?.length > 0) {

            collisions.forEach(collision => {

                const {x: positionX, y: positionY} = position.getPosition();
                const {x: colliderX, y: colliderY} = collider.position.getPosition();

                const deltaX = positionX - colliderX;
                const deltaY = positionY - colliderY;

                const resolution = resolveCollision(collider, collision);
                const {x: resolveX, y: resolveY} = resolution.getPosition();

                position.moveTo(resolveX + deltaX, resolveY + deltaY);
            });
        }
    };

    return {
        actions: {
            update
        }
    };
};