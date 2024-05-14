import { registry } from "../engine/game";

export const useDraw = () => {
    
    const act = () => {
        registry.getActionsByName('draw').forEach(entity => entity.forEach(action => action()));
    };

    return {
        act
    };
};