import { registry } from '../engine/game';

export const useDraw = () => {
    
    const act = () => registry().getActionsByName('draw')?.forEach(action => action());

    return {
        act
    };
};