import { registry } from "../engine/game";

export const commit = () => {
    
    const act = () => {
        registry.getActions('commit').forEach(action => action.act());
    };

    return {
        act
    };
};