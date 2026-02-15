import { registry, frameIndex } from '../game';

export const motionBody = ({
    position,
    motion,
    collider = null,
    obstructiveColliderComponent = null,
    lazySort = true
}) => {

    if (!position) throw new Error('position is not defined');
    if (!motion) throw new Error('motion is not defined');

    const move = () => {

        motion.apply(position);

        //Check collision
        if (!obstructiveColliderComponent || !collider) return;

        const colliders = registry().getComponentsByName(obstructiveColliderComponent);
        let results = colliders?.map(candidate => ({ candidate, point: collider.overlaps(candidate) }))
            .filter(({ point }) => point != null)
            .map(({ candidate, point }) => ({ collider: candidate, point }));
            
        if (!lazySort) results = results?.sort(() => frameIndex() % 2 - 1);
        return results;
    };

    return {
        move
    };
};