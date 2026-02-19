import { registry, frameIndex } from '../../engine/game';

export const useCollisionResponder = ({
    collider,
    obstructiveColliderComponents = [],
    callback,
    lazySort = true
}) => {

    const update = () => {

        if (!obstructiveColliderComponents?.length || !collider) return;

        let colliders = [];
        obstructiveColliderComponents.forEach(componentName => {
            const components = registry().getComponentsByName(componentName);
            if (components) colliders = colliders.concat(components);
        });
        colliders = colliders.filter(candidate => collider.overlaps(candidate).length);

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