import { usePosition } from '../../component/position/position';
import { useRectCollider } from '../../component/collision/rectCollider';
import { colliderOverlaps } from './overlapCollision';
import collisionTypes from './collisionTypes';

export const useQuadTree = ({
    x, y,
    width, height,
    capacity = 32
}) => {

    const position = usePosition({ x, y });
    const collider = useRectCollider({ position, width, height });

    const items = [];

    //children
    let northWest = null;
    let northEast = null;
    let southWest = null;
    let southEast = null;
    
    const isSubdivided = () => northWest !== null;

    const subdivide = () => {

        const subWidth = width / 2;
        const subHeight = height / 2;

        northWest = useQuadTree({ x: x - subWidth / 2, y: y - subHeight / 2, width: subWidth, height: subHeight, capacity });
        northEast = useQuadTree({ x: x + subWidth / 2, y: y - subHeight / 2, width: subWidth, height: subHeight, capacity });
        southWest = useQuadTree({ x: x - subWidth / 2, y: y + subHeight / 2, width: subWidth, height: subHeight, capacity });
        southEast = useQuadTree({ x: x + subWidth / 2, y: y + subHeight / 2, width: subWidth, height: subHeight, capacity });
        
        while(items.length > 0) {
            const item = items.shift();
            insert(item.collider);
        }
    };

    const insert = colliderToInsert => {

        if (!colliderToInsert || !colliderToInsert.position) return false;

        if (colliderToInsert.type === collisionTypes.quadTree) {
            throw new Error('quadTree cannot contain another quadTree');
        }

        const overlapsNode = colliderOverlaps(collider, colliderToInsert);
        if (!overlapsNode || overlapsNode.length === 0) return false;

        if (items.length < capacity && !isSubdivided()) {
            items.push({ collider: colliderToInsert });
            return true;
        }

        if (!isSubdivided()) {
            subdivide();
        }

        let inserted = false;
        if (northWest.insert(colliderToInsert)) inserted = true;
        if (northEast.insert(colliderToInsert)) inserted = true;
        if (southWest.insert(colliderToInsert)) inserted = true;
        if (southEast.insert(colliderToInsert)) inserted = true;

        return inserted;
    };

    const getItems = () => ([
        ...items,
        ...(northWest?.getItems() || []),
        ...(northEast?.getItems() || []),
        ...(southWest?.getItems() || []),
        ...(southEast?.getItems() || [])
    ]);

    const query = queryCollider => {

        if (!queryCollider) return [];

        const boundsOverlap = colliderOverlaps(collider, queryCollider);
        if (!boundsOverlap || boundsOverlap.length === 0) return [];

        if (isSubdivided()) { 
            return [
                ...northWest.query(queryCollider),
                ...northEast.query(queryCollider),
                ...southWest.query(queryCollider),
                ...southEast.query(queryCollider)
            ];
        }
 
        return getItems();
    };

    return {
        type: collisionTypes.quadTree,
        collider,
        insert,
        getItems,
        query
    };
};