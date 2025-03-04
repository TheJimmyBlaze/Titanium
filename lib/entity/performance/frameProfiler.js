
import { useEntity } from '../../engine/entity';
import { deltaTime, computeTime } from '../../engine/game';

export const useFrameProfiler = () => {

    const frames = [];

    const getFps = () => {
        purge();
        return frames.length;
    }

    const getAverageDeltaTime = () => frames.reduce((sum, frame) => sum + frame.deltaTime, 0) / frames.length;
    const getAverageComputeTime = () => frames.reduce((sum, frame) => sum + frame.computeTime, 0) / frames.length;
    const getPerformance = () => ((getAverageComputeTime() / (getAverageDeltaTime() * 1000)) * 100).toFixed(2);

    const purge = () => {

        const maxFrameAge = Date.now() - 1000;
        while(frames.length > 0 && frames[0].creation < maxFrameAge) {
            frames.shift();
        }
    };

    const profile = {
        actions: {
            update: () => {

                frames.push({
                    creation: Date.now(),
                    deltaTime: deltaTime(),
                    computeTime: computeTime()
                });

                purge();
            }
        }
    };

    const entity = useEntity({
        components: {
            profile
        }
    });

    return {
        ...entity,
        getFps,
        getAverageDeltaTime,
        getAverageComputeTime,
        getPerformance
    };
};