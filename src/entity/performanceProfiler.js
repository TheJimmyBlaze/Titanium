import { useEntity } from '../engine/entity';
import { useFrameProfiler } from '../component/performance/frameProfiler';

export const usePerformanceProfiler = ({
    drawCamera
}) => {

    const engineFrameProfiler = useFrameProfiler({drawCamera});

    const entity = useEntity({
        components: {
            engineFrameProfiler
        }
    });

    return {
        ...entity
    };
};