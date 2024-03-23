import { registry } from "../engine/game";

export const useUpdate = () => {
    
    const act = () => {
        registry.getAction('update').forEach(entity => entity.forEach(action => action()));
    };

    return {
        act
    };
};