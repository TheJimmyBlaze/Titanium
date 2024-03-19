import { registry } from "../engine/game";

export const commit = () => {
    
    const act = () => {
        registry.getAction('commit').forEach(action => action());
    };

    return {
        act
    };
};