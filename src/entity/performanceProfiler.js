import { useFrameProfiler } from '../component/performance/frameProfiler';

export const performanceProfiler = ({
    drawCamera
}) => {

    const name = 'performanceProfiler';

    const frameProfiler = useFrameProfiler({drawCamera});

    const performanceProfiler = useEntity({
        name,
        components: [
            frameProfiler
        ]
    });

    return {
        ...performanceProfiler
    };
};