import { useText } from '../../component/ui/text';
import { usePosition } from '../../component/position/position';
import { useEntity } from '../../engine/entity';

export const usePerformanceDisplay = ({
    profiler,
    size = 10,
    foreground = 'debug',
    padding = 16,
    style,
    drawCamera
}) => {

    const position = usePosition();

    const fps = useText({
        position,
        text: 'FPS: 0',
        size,
        foreground,
        style,
        drawCamera
    });

    const performance = useText({
        position: usePosition({y: 10, parent: position}),
        text: 'Perf: 0',
        size,
        foreground,
        style,
        drawCamera
    });

    const positionTracker = {
        actions: {
            update: () => {
        
                position.moveTo(
                    -drawCamera.getWidth() / 2 + padding,
                    -drawCamera.getHeight() / 2 + padding
                );
        
                fps.setText(`FPS: ${profiler.getFps()}`);
                performance.setText(`Perf: ${profiler.getPerformance()}`);
            }
        }
    };

    const entity = useEntity({
        components: {
            profiler,
            fps,
            performance,
            positionTracker
        }
    });

    return {
        ...entity
    };
};