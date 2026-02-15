import { deltaTime } from './game';

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const lerp = (a, b, smoothing) => {
        
    const deltaSmoothing = 1 - Math.pow(smoothing, deltaTime());
    return a * (1 - deltaSmoothing) + b * deltaSmoothing;
};