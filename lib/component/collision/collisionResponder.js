import { registry } from '../../engine/game';

export const useCollisionResponder = ({
    collider,
    obstructiveColliderComponent,
    callback,
    lazySort = true
}) => {

    const update = () => {

        if (!obstructiveColliderComponent || !collider) return;

        let colliders = registry().getComponentsByName(obstructiveColliderComponent);
        colliders = colliders?.filter(candidate => collider.overlaps(candidate).length);

        if (!lazySort) colliders = colliders?.sort(() => frameIndex() % 2 - 1);
        
        colliders?.forEach(collider => {

            const collidedId = collider.entityId;
            const collided = registry().getEntityById(collidedId);

            callback(collided);
        });
    };

    return {
        actions: {
            update
        }
    };
};