import { registry, frameIndex } from '../game';

export const motionBody = ({
    obstructiveColliderComponent,
    position,
    motion,
    collider
}) => {

    if (!position) throw new Error('position is not defined');
    if (!motion) throw new Error('motion is not defined');

    const move = () => {

        motion.apply(position);

        //Check collision
        if (!obstructiveColliderComponent || !collider) return;

        const colliders = registry.getComponentsByName(obstructiveColliderComponent);
        const collisions = colliders?.filter(candidate => collider.overlaps(candidate))?.sort(() => frameIndex() % 2 - 1);
        
        return collisions;
    };

    return {
        move
    };
};