import { useText } from '../../component/ui/text';
import { deltaTime, computeTime } from '../../engine/game';
import { usePosition } from '../../component/position/position';
import { useEntity } from '../../engine/entity';

export const useFrameProfiler = ({
    font,
    size = 10,
    foreground,
    colours,
    padding = 16,
    drawCamera
}) => {

    const position = usePosition();
    const frames = [];

    const getFps = () => frames.length;

    const getAverageDeltaTime = () => frames.reduce((sum, frame) => sum + frame.deltaTime, 0) / frames.length;
    const getAverageComputeTime = () => frames.reduce((sum, frame) => sum + frame.computeTime, 0) / frames.length;
    const getPerformance = () => ((getAverageComputeTime() / (getAverageDeltaTime() * 1000)) * 100).toFixed(2);

    const fps = useText({
        position,
        text: 'FPS: 0',
        font,
        size,
        foreground,
        colours,
        drawCamera
    });
    const performance = useText({
        position: usePosition({y: 10, parent: position}),
        text: 'Perf: 0',
        font,
        size,
        foreground,
        colours,
        drawCamera
    });

    const performanceTracker = {
        actions: {
            update: () => {

                frames.push({
                    creation: Date.now(),
                    deltaTime: deltaTime(),
                    computeTime: computeTime()
                });
        
                const maxFrameAge = Date.now() - 1000;
                while(frames.length > 0 && frames[0].creation < maxFrameAge) {
                    frames.shift();
                }
        
                position.moveTo(
                    -drawCamera.getWidth() / 2 + padding,
                    -drawCamera.getHeight() / 2 + padding
                );
        
                fps.setText(`FPS: ${getFps()}`);
                performance.setText(`Perf: ${getPerformance()}`);
            }
        }
    };

    const entity = useEntity({
        components: {
            fps,
            performance,
            performanceTracker
        }
    });

    return {
        ...entity
    };
};