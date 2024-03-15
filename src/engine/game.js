import { Registry } from "./registry";

let lastTime = 0;
export const timestamp = () => lastTime;

let lastDeltaTime = 0;
export const deltaTime = () => lastDeltaTime;

let lastComputeTime = 0;
export const computeTime = () => lastComputeTime;

export const registry = Registry();

export const Game = () => {
    
    const update = () => {
        registry.find('update').forEach(id => registry.get(id).update?.());
    };

    const draw = () => {
        registry.find('draw').forEach(id => registry.get(id).draw?.())
    };

    const commit = () => {
        registry.find('commit').forEach(id => registry.get(id).commit?.())
    };

    const animate = async timestamp => {

        const computeStartTime = performance.now();
        lastDeltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        update();
        draw();
        commit();

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