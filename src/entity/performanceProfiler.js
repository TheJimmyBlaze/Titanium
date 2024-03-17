import { useEntity } from '../engine/entity';
import { useFrameProfiler } from '../component/performance/frameProfiler';

export const performanceProfiler = ({
    drawCamera
}) => {

    const name = 'performanceProfiler.engine';

    const engineFrameProfiler = useFrameProfiler({drawCamera});

    const entity = useEntity({
        name,
        components: [
            engineFrameProfiler
        ]
    });

    return {
        ...entity
    };
};