import { registry, frameIndex } from '../game';

export const motionBody = ({
    position,
    motion,
    collider,
    obstructiveColliderComponent,
    lazy = true
}) => {

    if (!position) throw new Error('position is not defined');
    if (!motion) throw new Error('motion is not defined');

    const move = () => {

        motion.apply(position);

        //Check collision
        if (!obstructiveColliderComponent || !collider) return;

        const colliders = registry().getComponentsByName(obstructiveColliderComponent);
        let collisions = colliders?.filter(candidate => collider.overlaps(candidate));
        
        if (!lazy) collisions = collisions?.sort(() => frameIndex() % 2 - 1); 
        
        return collisions;
    };

    return {
        move
    };
};