import { registry } from '../../engine/game';
import { motionBody } from '../../engine/collision/motionBody';

export const useProjectileBody = ({
    entityId,
    position,
    endPosition,
    motion,
    collider,
    obstructiveColliderComponent,
    collisionCallback,
    lazySort,
    destroyOnHit = true,
}) => {

    const body = motionBody({
        obstructiveColliderComponent,
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

        collisions.forEach(collision => {
            
            const collidedId = collision.entityId;
            const collided = registry().getEntityById(collidedId);
            
            collisionCallback?.(collided);
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