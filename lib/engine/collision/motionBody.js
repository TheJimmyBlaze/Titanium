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

        if (!obstructiveColliderComponent || !collider) return;

        const components = registry().getComponentsByName(obstructiveColliderComponent);
        if (!components) return;

        let results = [];        
        components.forEach(component => {
            const overlaps = collider.overlaps(component);
            results.push(...overlaps);
        });
            
        if (!lazySort) results = results?.sort(() => frameIndex() % 2 - 1);
        return results;
    };

    return {
        move
    };
};