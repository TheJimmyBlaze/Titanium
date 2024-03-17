import { registry } from "../engine/game";

export const draw = () => {
    
    const act = () => {
        registry.getActions('draw').forEach(action => action.act());
    };

    return {
        act
    };
};