import { registry, frameIndex } from '../game';

export const motionBody = ({
    position,
    motion,
    collider = null,
    obstructiveColliderComponents = [],
    lazySort = true
}) => {

    if (!position) throw new Error('position is not defined');
    if (!motion) throw new Error('motion is not defined');

    const move = () => {

        motion.apply(position);

        if (!obstructiveColliderComponents?.length || !collider) return;

        let results = [];
        obstructiveColliderComponents.forEach(componentName => {

            const components = registry().getComponentsByName(componentName);
            if (!components) return;
            
            components.forEach(component => {
                const overlaps = collider.overlaps(component);
                results.push(...overlaps);
            });
        });

        if (!lazySort) results = results?.sort(() => frameIndex() % 2 - 1);
        return results;
    };

    return {
        move
    };
};