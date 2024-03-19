import { registry } from "../engine/game";

export const draw = () => {
    
    const act = () => {
        registry.getAction('draw').forEach(action => action());
    };

    return {
        act
    };
};