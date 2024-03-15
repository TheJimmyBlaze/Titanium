import { usePosition } from "./position";

export const useLine = ({
    startPosition,
    endPosition
}) => {

    if (!startPosition) throw new error('start position not defined');
    if (!endPosition) throw new error('end position is not defined');

    const state = {
        startPosition,
        endPosition
    };

    const getStartPosition = () => state.startPosition;
    const setStartPosition = position => state.startPosition = position;

    const getEndPosition = () => state.endPosition;
    const setEndPosition = position => state.endPosition = position;
    
    const findClosestPositionOnLine = position => {

        const {x: aX, y: aY} = getStartPosition().getPosition();
        const {x: bX, y: bY} = getEndPosition().getPosition();
        const {x: pX, y: pY} = position.getPosition();
    
        const vectorAToBX = bX - aX;
        const vectorAToBY = bY - aY;
        const vectorAToPX = pX - aX
        const vectorAToPY = pY - aY;
    
        const length = vectorAToBX * vectorAToBX + vectorAToBY * vectorAToBY;
        const dot = vectorAToPX * vectorAToBX + vectorAToPY * vectorAToBY;
        const t = Math.min(1, Math.max(0, dot / length));
    
        const resolveX = aX + vectorAToBX * t;
        const resolveY = aY + vectorAToBY * t;
    
        return usePosition(resolveX, resolveY);
    };

    return {
        getStartPosition,
        setStartPosition,
        getEndPosition,
        setEndPosition,
        findClosestPositionOnLine
    };
};