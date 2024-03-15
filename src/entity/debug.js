
import { deltaTime, computeTime } from '../engine/game';

export const Debug = ({
    camera
}) => {

    const debugColour = 'lime';

    const frames = [];

    const getFps = () => frames.length;

    const getAverageDeltaTime = () => frames.reduce((sum, frame) => sum + frame.deltaTime, 0) / frames.length;
    const getAverageComputeTime = () => frames.reduce((sum, frame) => sum + frame.computeTime, 0) / frames.length;
    const getPerformance = () => ((getAverageComputeTime() / (getAverageDeltaTime() * 1000)) * 100).toFixed(2);

    const update = () => {

        frames.push({
            creation: Date.now(),
            deltaTime: deltaTime(),
            computeTime: computeTime()
        });

        const maxFrameAge = Date.now() - 1000;
        while(frames.length > 0 && frames[0].creation < maxFrameAge) {
            frames.shift();
        }
    };

    const draw = () => {

        camera.requestDraw(ctx => {

            ctx.strokeStyle = ctx.fillStyle = debugColour;
            ctx.beginPath();

            ctx.font = '10px RedVector';

            ctx.fillText(`FPS: ${getFps()}`, 16, 16);
            ctx.fillText(`Perf: ${getPerformance()}%`, 16, 26);

            ctx.stroke();
        });
    };

    return {
        update,
        draw
    };
};