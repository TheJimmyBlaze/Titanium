
import * as packageInfo from './package.json';
export const getVersion = () => `${packageInfo.name}: ${packageInfo.version}`;

//Engine
export { timestamp, deltaTime, computeTime, useGame, registry } from './src/engine/game';
export { lerp } from './src/engine/math';
export { useEntity } from './src/engine/entity';

//Component
export { usePointCollider } from './src/component/collision/pointCollider';
export { useLineCollider } from './src/component/collision/lineCollider';
export { useCircleCollider } from './src/component/collision/circleCollider';
export { useRectCollider } from './src/component/collision/rectCollider';

export { useCamera } from './src/component/graphics/camera';
export { useCanvas } from './src/component/graphics/canvas';

export { useFrameProfiler } from './src/component/performance/frameProfiler';

export { usePosition } from './src/component/position/position';
export { useLine } from './src/component/position/line';

//Entity
export { usePerformanceProfiler } from './src/entity/performanceProfiler';

//System
//Nothing yet...