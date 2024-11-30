
export const useRegistry = () => {

    const entityIndex = {};

    const componentIndex = {};
    const actionIndex = {};

    const entities = () => entityIndex;
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

            //Register component index
            const component = components[componentName];

            ((componentIndex[componentName] ||= {})[id] ||= []).push(component);

            const multiComponentIterator = Array.isArray(component) && component || ([component]);
            multiComponentIterator.forEach(componentInstance => {

                //Include a reverse lookup key
                componentInstance.entityId = id;

                const { actions = {} } = componentInstance;
                Object.keys(actions).forEach(actionName => {
    
                    //Register action index
                    const action = actions[actionName];
                    
                    //Include a reverse lookup key
                    action.entityId = id;

                    ((actionIndex[actionName] ||= {})[id] ||= []).push(action);
                });
            });
        });
    };

    const deregister = entity => {

        if (!entity) return;

        const { 
            id,
            components = {},
            onDeregister
        } = entity;
        if (!id) throw new Error('id is not defined');

        onDeregister?.();

        //Deregister entity index
        delete entityIndex[id];

        Object.keys(components).forEach(componentName => {

            //Deregister component index
            delete componentIndex[componentName][id];
            if (Object.keys(componentIndex[componentName]).length === 0) {
                delete componentIndex[componentName];   //Clear empties
            }

            const component = components[componentName];
            const multiComponentIterator = Array.isArray(component) && component || ([component]);
            multiComponentIterator.forEach(componentInstance => {

                const { actions = {} } = componentInstance;
                Object.keys(actions).forEach(actionName => {

                    //Deregister action index
                    delete actionIndex[actionName][id];
                    if (Object.keys(actionIndex[actionName]).length === 0) {
                        delete actionIndex[actionName];
                    }
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
        entities,
        getEntityById,
        getComponentsByName,
        getActionsByName,
        register,
        deregister,
        stringify
    };
};