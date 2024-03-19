import { registry } from "../engine/game";

export const update = () => {
    
    const act = () => {
        registry.getAction('update').forEach(action => action());
    };

    return {
        act
    };
};