
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

export { default } from './engine/ui/style';

//Component
export { usePointCollider } from './component/collision/pointCollider';
export { useLineCollider } from './component/collision/lineCollider';
export { useCircleCollider } from './component/collision/circleCollider';
export { useRectCollider } from './component/collision/rectCollider';
export { useCollisionResponder } from './component/collision/collisionResponder';
export { useRigidBody } from './component/collision/rigidBody';
export { useProjectileBody } from './component/collision/projectileBody';

export { useCameraCtx } from './component/graphics/cameraCtx';
export { useCameraGlx } from './component/graphics/cameraGlx';
export { useCanvasCtx } from './component/graphics/canvasCtx';
export { useCanvasGlx } from './component/graphics/canvasGlx';
export { useSprite } from './component/graphics/sprite';

export { usePosition } from './component/position/position';
export { useLine } from './component/position/line';
export { useMotion } from './component/position/motion';

export { useFiniteStateMachine } from './component/stateMachine/finiteStateMachine';

export { useText } from './component/ui/text';
export { useTextBox } from './component/ui/textBox';
export { usePanel } from './component/ui/panel';
export { useButton } from './component/ui/button';
export { useProgressBar } from './component/ui/progressBar';
export { useRadialBar } from './component/ui/radialBar';

//Entity
export { useFrameProfiler } from './entity/performance/frameProfiler';
export { usePerformanceDisplay } from './entity/performance/performanceDisplay';