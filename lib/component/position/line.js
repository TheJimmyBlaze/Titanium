import { clamp } from '../../engine/math';
import { usePosition } from './position';

export const useLine = ({
    startPosition,
    endPosition
}) => {

    if (!startPosition) throw new Error('start position not defined');
    if (!endPosition) throw new Error('end position is not defined');

    const state = {
        startPosition,
        endPosition
    };

    const getStartPosition = () => state.startPosition;
    const setStartPosition = position => state.startPosition = position;

    const getEndPosition = () => state.endPosition;
    const setEndPosition = position => state.endPosition = position;

    const getLength = () => {

        const {x: aX, y: aY} = getStartPosition().getPosition();
        const {x: bX, y: bY} = getEndPosition().getPosition();

        const vectorAToBX = bX - aX;
        const vectorAToBY = bY - aY;

        const length = Math.sqrt(vectorAToBX * vectorAToBX + vectorAToBY * vectorAToBY);
        return length;
    }
    
    const findClosestPositionOnLine = position => {

        const {x: aX, y: aY} = getStartPosition().getPosition();
        const {x: bX, y: bY} = getEndPosition().getPosition();

        if (aX === bX && aY === bY) return usePosition({x: aX, y: aY});

        const {x: pX, y: pY} = position.getPosition();
    
        const vectorAToBX = bX - aX;
        const vectorAToBY = bY - aY;
        const vectorAToPX = pX - aX
        const vectorAToPY = pY - aY;
    
        const length = vectorAToBX * vectorAToBX + vectorAToBY * vectorAToBY;
        const dot = vectorAToPX * vectorAToBX + vectorAToPY * vectorAToBY;
        const t = clamp(dot / length, 0, 1);
    
        const resolveX = aX + vectorAToBX * t;
        const resolveY = aY + vectorAToBY * t;
    
        return usePosition({x: resolveX, y: resolveY});
    };

    const findDistancePositionOnLine = distance => {

        const {x: aX, y: aY} = getStartPosition().getPosition();
        const {x: bX, y: bY} = getEndPosition().getPosition();

        const slope = (bY - aY) / (bX - aX);
        const theta = Math.atan(slope);

        const invert = aX - bX > 0 ? 1 : -1;

        const resolveX = bX + (invert * distance) * Math.cos(theta);
        const resolveY = bY + (invert * distance) * Math.sin(theta);

        return usePosition({x: resolveX, y: resolveY});
    };

    return {
        getStartPosition,
        setStartPosition,
        getEndPosition,
        setEndPosition,
        getLength,
        findClosestPositionOnLine,
        findDistancePositionOnLine
    };
};