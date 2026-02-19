import { registry } from '../../engine/game';
import { motionBody } from '../../engine/collision/motionBody';
import { resolveCollision } from '../../engine/collision/collisionResolver';

export const useProjectileBody = ({
    entityId,
    position,
    endPosition,
    motion,
    collider,
    obstructiveColliderComponents = [],
    collisionCallback,
    lazySort,
    destroyOnHit = true,
}) => {

    const body = motionBody({
        obstructiveColliderComponents,
        position,
        motion,
        collider,
        lazySort
    });

    const destroy = () => {

        if (!destroyOnHit) return;

        const projectileEntity = registry().getEntityById(entityId);
        registry().deregister(projectileEntity);
    };

    const update = () => {

        const newEndPosition = position.copy();
        const collisions = body.move();

        endPosition?.moveToPosition(newEndPosition);

        if (!collisions?.length) return;

        collisions.forEach(hit => {

            const collided = registry().getEntityById(hit.entityId);
            collisionCallback?.(collided);

            const resolution = resolveCollision(collider, collisions[0]);
            position.moveToPosition(resolution);

            destroy();
        });
    };

    return {
        position,
        endPosition,
        motion,
        collider,
        actions: {
            update
        }
    };
};