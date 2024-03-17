import { update } from '../system/update';
import { draw } from '../system/draw';
import { commit } from '../system/commit';
import { Registry } from "./registry";

let lastTime = 0;
export const timestamp = () => lastTime;

let lastDeltaTime = 0;
export const deltaTime = () => lastDeltaTime;

let lastComputeTime = 0;
export const computeTime = () => lastComputeTime;

export const registry = Registry();

export const Game = ({
    systems = []
}) => {

    const engineSystems = [
        update(),
        draw(),
        commit()
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