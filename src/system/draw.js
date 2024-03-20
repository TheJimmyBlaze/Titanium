import { registry } from "../engine/game";

export const useDraw = () => {
    
    const act = () => {
        registry.getAction('draw').forEach(action => action());
    };

    return {
        act
    };
};