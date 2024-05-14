
export const useRegistry = () => {

    const entityIndex = {};

    const componentIndex = {};
    const actionIndex = {};

    const getEntityById = id => entityIndex[id];

    const getComponentsByName = name => (
        componentIndex[name] && 
        Object.values(
            Object.values(componentIndex[name]).flat()
        ).flat()
    );
    
    const getActionsByName = name => (
        actionIndex[name] && 
        Object.values(
            Object.values(actionIndex[name]).flat()
        ).flat()
    );

    const register = entity => {

        const {
            id,
            components = {}
        } = entity;

        if (!id) throw new Error('id is not defined');
        
        //Register entity index
        entityIndex[id] = entity;

        Object.keys(components).forEach(componentName => {

            //Register component Index
            const component = components[componentName];
            ((componentIndex[componentName] ||= {})[id] ||= []).push(component);

            const multiComponentIterator = Array.isArray(component) && component || ([component]);
            multiComponentIterator.forEach(componentInstance => {

                const { actions = {} } = componentInstance;
                Object.keys(actions).forEach(actionName => {
    
                    //Register action Index
                    const action = actions[actionName];
                    ((actionIndex[actionName] ||= {})[id] ||= []).push(action);
                });
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
        getComponentsByName,
        getActionsByName,
        register,
        stringify
    };
};