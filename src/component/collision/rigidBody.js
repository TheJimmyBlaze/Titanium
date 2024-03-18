
import { deltaTime, registry } from '../../engine/game';
import { resolveCollision } from './collisionResolver';

const useRigidBody = ({
    obstructiveColliderComponent,
    position,
    motion,
    collider
}) => {

    const move = () => {
      
        //Calculate movement
        const invertedDrag = 1 - motion.drag;
        motion.velocityX *= invertedDrag;
        motion.velocityY *= invertedDrag;

        const deltaX = motion.velocityX * deltaTime();
        const deltaY = motion.velocityY * deltaTime();
        
        //Check collision
        position.move(deltaX, deltaY);
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
        move
    };
};

export default useRigidBody;