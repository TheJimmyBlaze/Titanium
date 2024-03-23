import { registry } from "../engine/game";

export const useCommit = () => {
    
    const act = () => {
        registry.getAction('commit').forEach(entity => entity.forEach(action => action()));
    };

    return {
        act
    };
};