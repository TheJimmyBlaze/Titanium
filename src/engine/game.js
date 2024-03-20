import { update } from '../system/update';
import { draw } from '../system/draw';
import { commit } from '../system/commit';

import { useRegistry } from './registry';
import { useInputAccess } from './input/inputAccess';
import { useMousePosition } from './input/mousePosition'; 

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

    const postSystems = [
        draw(),
        update(),
        commit()
    ];
    
    const allSystems = [
        ...systems,
        ...postSystems
    ];

    const act = () => {
        allSystems.forEach(system => system.act());
    };

    const animate = async timestamp => {

        const computeStartTime = performance.now();
        lastDeltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        act();

        //Uncomment this to add fps lag
        //await new Promise(r => setTimeout(r, 40));

        lastComputeTime = performance.now() - computeStartTime;
        requestAnimationFrame(animate);
    };

    const start = () => animate(0);

    return {
        start
    };
};