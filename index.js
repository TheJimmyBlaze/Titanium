
import * as packageInfo from './package.json';
export const getVersion = () => `${packageInfo.name}: ${packageInfo.version}`;

//Engine
export { timestamp, deltaTime, computeTime, Game } from './src/engine/game';
export { lerp } from './src/engine/math';

//Entity
export { Canvas } from './src/entity/canvas';
export { Camera } from './src/entity/camera';

//Component
export { usePosition } from './src/component/position';
export { useLine } from './src/component/line';

export { usePointCollider } from './src/component/collider/pointCollider';
export { useLineCollider } from './src/component/collider/lineCollider';
export { useCircleCollider } from './src/component/collider/circleCollider';
export { useRectCollider } from './src/component/collider/rectCollider';

//System