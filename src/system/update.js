import { registry } from "../engine/game";

export const useUpdate = () => {
    
    const act = () => {
        registry.getActionsByName('update').forEach(entity => entity.forEach(action => action()));
    };

    return {
        act
    };
};