import { useUpdate } from '../system/update';
import { useDraw } from '../system/draw';
import { useCommit } from '../system/commit';

import { useRegistry } from './registry';
import { useInputAccess } from './input/inputAccess';

let lastTime = 0;
export const timestamp = () => lastTime;

let lastDeltaTime = 0;
export const deltaTime = () => lastDeltaTime;

let lastComputeTime = 0;
export const computeTime = () => lastComputeTime;

export const input = useInputAccess();
export const registry = useRegistry();

export const useGame = ({
    systems = []
}) => {

    const engineSystems = [
        useDraw(),
        useUpdate(),
        useCommit()
    ];
    
    const allSystems = [
        ...systems,
        ...engineSystems
    ];

    const act = () => {
        allSystems.forEach(system => system.act());
    };

    const animate = async timestamp => {

        const computeStartTime = performance.now();
        
        act();
        
        //Uncomment below to add fps lag
        //await new Promise(r => setTimeout(r, 40));
        
        lastComputeTime = performance.now() - computeStartTime;
        lastDeltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        
        requestAnimationFrame(animate);
    };

    const start = () => animate(0);

    return {
        start
    };
};