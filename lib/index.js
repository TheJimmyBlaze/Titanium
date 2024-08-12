
import * as packageInfo from '../package.json';
export const getVersion = () => `${packageInfo.name}: ${packageInfo.version}`;

//Engine
export { 

    frameIndex,
    timestamp, 
    lastTimestamp,
    deltaTime, 
    computeTime, 
    
    input,
    setInput,
    registry,
    setRegistry,

    useGame
} from './engine/game';

export { useRegistry } from './engine/registry';
export { useInputAccess } from './engine/input/inputAccess';

export { lerp } from './engine/math';

export { resolveCollision } from './engine/collision/collisionResolver';
export { colliderContains } from './engine/collision/containCollision';
export { colliderOverlaps } from './engine/collision/overlapCollision';
export { motionBody } from './engine/collision/motionBody';

export { useEntity } from './engine/entity';
export { useSpriteSheet } from './engine/graphics/spriteSheet';
export { useSpriteSheetRun } from './engine/graphics/spriteSheetRun';
export { useSpriteOptions } from './engine/graphics/spriteOptions';

export { 
    colour,
    mono,
    colours,
    darken
} from './engine/ui/colours';

//Component
export { usePointCollider } from './component/collision/pointCollider';
export { useLineCollider } from './component/collision/lineCollider';
export { useCircleCollider } from './component/collision/circleCollider';
export { useRectCollider } from './component/collision/rectCollider';
export { useRigidBody } from './component/collision/rigidBody';
export { useProjectileBody } from './component/collision/projectileBody';

export { useCamera } from './component/graphics/camera';
export { useCanvas } from './component/graphics/canvas';
export { useSprite } from './component/graphics/sprite';

export { useFrameProfiler } from './component/performance/frameProfiler';

export { usePosition } from './component/position/position';
export { useLine } from './component/position/line';
export { useMotion } from './component/position/motion';

export { useFiniteStateMachine } from './component/stateMachine/finiteStateMachine';

export { useButton } from './component/ui/button';
export { useProgressBar } from './component/ui/progressBar';