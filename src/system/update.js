import { registry } from "../engine/game";

export const update = () => {
    
    const act = () => {
        registry.getActions('update').forEach(action => action.act());
    };

    return {
        act
    };
};