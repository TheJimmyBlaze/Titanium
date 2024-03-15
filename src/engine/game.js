
let lastTime = 0;
export const timestamp = () => lastTime;

let lastDeltaTime = 0;
export const deltaTime = () => lastDeltaTime;

let lastComputeTime = 0;
export const computeTime = () => lastComputeTime;

export const useGame = ({
    entities = []
}) => {
    
    const update = () => {
        entities.forEach(entity => entity.update?.());
    };

    const draw = () => {
        entities.forEach(entity => entity.draw?.())
    };

    const animate = async timestamp => {

        const computeStartTime = performance.now();
        lastDeltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        update();
        draw();

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