import { registry } from "../engine/game";

export const useUpdate = () => {
    
    const act = () => {
        registry.getAction('update').forEach(action => action());
    };

    return {
        act
    };
};