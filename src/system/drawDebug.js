import { registry } from "../engine/game";

export const useDrawDebug = () => {
    
    const act = () => {
        registry.getActionsByName('drawDebug').forEach(action => action());
    };

    return {
        act
    };
};