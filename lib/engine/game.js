import { useRegistry } from './registry';

import { useUpdate } from '../system/update';
import { useDraw } from '../system/draw';
import { useCommit } from '../system/commit';

import { useInputAccess } from './input/inputAccess';

let frameIndexNumber = 0;
export const frameIndex = () => frameIndexNumber;

let lastTime = 0;
export const timestamp = () => lastTime;

let previousLastTime = 0;
export const lastTimestamp = () => previousLastTime;

let lastDeltaTime = 0;
export const deltaTime = () => lastDeltaTime;

let lastComputeTime = 0;
export const computeTime = () => lastComputeTime;

let activeInput = useInputAccess();
export const input = () => activeInput;
export const setInput = value => activeInput = value; 

let activeRegistry = useRegistry();
export const registry = () => activeRegistry;
export const setRegistry = value => activeRegistry = value;

export const useGame = ({
    systems = []
} = {}) => {

    const engineSystems = [
        useUpdate(),
        useDraw(),
        useCommit()
    ];
    
    const allSystems = [
        ...systems,
        ...engineSystems
    ];

    const act = () => allSystems.forEach(system => system.act());

    const animate = async timestamp => {
        
        act();
        
        //Uncomment below to add fps lag
        //await new Promise(r => setTimeout(r, 40));

        frameIndexNumber++;
        frameIndexNumber > Number.MAX_SAFE_INTEGER && (frameIndexNumber = 0);

        lastComputeTime = performance.now() - timestamp;
        lastDeltaTime = (timestamp - lastTime) / 1000;
        previousLastTime = lastTime;
        lastTime = timestamp;
        
        requestAnimationFrame(animate);
    };

    const start = () => animate(0);

    return {
        start
    };
};