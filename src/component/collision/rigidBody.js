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
        const colliderIds = registry.findComponent(obstructiveColliderComponent);
        const colliders = colliderIds.map(id => registry.getId(id).components.collisionComponentName);

        const collisions = colliders.filter(candidate => collider.overlaps(candidate));
        if (collisions?.length > 0) {

            collisions.forEach(collision => {

                const resolution = resolveCollision(collider, collision.collider);
                const {x, y} = resolution.getPosition();
                position.moveTo(x, y);
            });
        }
    };

    return {
        actions: {
            update
        }
    };
};