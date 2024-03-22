
import * as packageInfo from './package.json';
export const getVersion = () => `${packageInfo.name}: ${packageInfo.version}`;

//Engine
export { 

    timestamp, 
    deltaTime, 
    computeTime, 
    
    input,
    registry,

    useGame
} from './src/engine/game';

export { lerp } from './src/engine/math';
export { resolveCollision } from './src/engine/collision/collisionResolver';
export { colliderContains } from './src/engine/collision/containCollision';
export { colliderOverlaps } from './src/engine/collision/overlapCollision';
export { useEntity } from './src/engine/entity';
export { useSpriteSheet } from './src/engine/graphics/spriteSheet';
export { useSpriteSheetRun } from './src/engine/graphics/spriteSheetRun';

//Component
export { usePointCollider } from './src/component/collision/pointCollider';
export { useLineCollider } from './src/component/collision/lineCollider';
export { useCircleCollider } from './src/component/collision/circleCollider';
export { useRectCollider } from './src/component/collision/rectCollider';
export { useRigidBody } from './src/component/collision/rigidBody';

export { useCamera } from './src/component/graphics/camera';
export { useCanvas } from './src/component/graphics/canvas';
export { useSprite } from './src/component/graphics/sprite';

export { useFrameProfiler } from './src/component/performance/frameProfiler';

export { usePosition } from './src/component/position/position';
export { useLine } from './src/component/position/line';
export { useMotion } from './src/component/position/motion';

export { useFiniteStateMachine } from './src/component/stateMachine/finiteStateMachine';

//Entity
export { usePerformanceProfiler } from './src/entity/performance/performanceProfiler';

//System
//Nothing yet...