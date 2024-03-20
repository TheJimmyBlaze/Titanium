import { registry } from "../engine/game";

export const useCommit = () => {
    
    const act = () => {
        registry.getAction('commit').forEach(action => action());
    };

    return {
        act
    };
};