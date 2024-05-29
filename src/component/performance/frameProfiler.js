import { deltaTime, computeTime } from '../../engine/game';

export const useFrameProfiler = ({
    drawCamera,
    drawColour = 'Lime'
}) => {

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

        drawCamera.requestDraw(ctx => {

            const x = -(ctx.canvas.width / drawCamera.getZoomScale()) / 2 + 16;
            const y = -(ctx.canvas.height / drawCamera.getZoomScale()) / 2 + 16;

            ctx.strokeStyle = ctx.fillStyle = drawColour;
            ctx.beginPath();

            ctx.font = '10px RedVector';

            ctx.fillText(`FPS: ${getFps()}`, x, y);
            ctx.fillText(`Perf: ${getPerformance()}%`, x, y + 10);

            ctx.stroke();
        });
    };

    return {
        actions: {
            update,
            draw
        }
    };
};