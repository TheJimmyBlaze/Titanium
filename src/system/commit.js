import { registry } from "../engine/game";

export const useCommit = () => {
    
    const act = () => {
        registry.getActionsByName('commit').forEach(entity => entity.forEach(action => action()));
    };

    return {
        act
    };
};