
export const useRegistry = () => {

    const idIndex = {};
    const componentIndex = {};
    const actionIndex = {};

    const getId = id => idIndex[id];
    const getComponent = component => componentIndex[component] && Object.values(componentIndex[component]);
    const getAction = action => actionIndex[action] && Object.values(actionIndex[action]);

    const register = entity => {

        const {
            id,
            components = {}
        } = entity;

        if (!id) throw new Error('id is not defined');
        
        idIndex[id] = entity;

        Object.keys(components).forEach(component => {

            (componentIndex[component] ||= {})[id] = entity;

            const { actions = {} } = components[component];
            Object.keys(actions).forEach(action => {
                ((actionIndex[action] ||= {})[id] ||= []).push(actions[action]);
            });
        });
    };

    const stringify = () => JSON.stringify({
        idIndex: Object.keys(idIndex), 
        componentIndex: Object.fromEntries(Object.entries(componentIndex).map(([key, value]) => [key, Object.keys(value)])), 
        actionIndex: Object.fromEntries(Object.entries(actionIndex).map(([key, value]) => [key, Object.keys(value)])), 
    });

    return {
        getId,
        getComponent,
        getAction,
        register,
        stringify
    };
};