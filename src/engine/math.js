import { deltaTime } from './game';

export const lerp = (a, b, smoothing) => {
        
    const deltaSmoothing = 1 - Math.pow(smoothing, deltaTime());
    return a * (1 - deltaSmoothing) + b * deltaSmoothing;
};