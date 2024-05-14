
export const useRegistry = () => {

    const entityIndex = {};

    const componentEntityIdIndex = {};
    const actionEntityIdIndex = {};

    const componentIndex = {};
    const actionIndex = {};

    const getEntityById = id => entityIndex[id];

    const getEntityIdsByComponentName = name => { throw new Error('not implemented'); };
    const getEntityIdsByActionName = name => { throw new Error('not implemented'); };

    const getComponentsByName = name => componentIndex[name] && Object.values(componentIndex[name]);
    const getActionsByName = name => actionIndex[name] && Object.values(actionIndex[name]);

    const register = entity => {

        const {
            id,
            components = {}
        } = entity;

        if (!id) throw new Error('id is not defined');
        
        //Register entity index
        entityIndex[id] = entity;

        Object.keys(components).forEach(component => {

            //Register componentEntityIdIndex
            //TODO: do

            //Register component Index
            (componentIndex[component] ||= []).push(components[component]);

            const { actions = {} } = components[component];
            Object.keys(actions).forEach(action => {

                //Register actionEntityIdIndex
                //TODO: do

                //Register action Index
                (actionIndex[action] ||= []).push(actions[action]);
            });
        });
    };

    const stringify = () => JSON.stringify({
        idIndex: Object.keys(entityIndex), 
        componentIndex: Object.fromEntries(Object.entries(componentIndex).map(([key, value]) => [key, Object.keys(value)])), 
        actionIndex: Object.fromEntries(Object.entries(actionIndex).map(([key, value]) => [key, Object.keys(value)])), 
    });

    return {
        getEntityById,
        getEntityIdsByComponentName,
        getEntityIdsByActionName,
        getComponentsByName,
        getActionsByName,
        register,
        stringify
    };
};