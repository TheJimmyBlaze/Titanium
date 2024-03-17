
export const useRegistry = () => {

    const idIndex = {};
    const nameIndex = {};
    const componentIndex = {};
    const actionIndex = {};

    const getId = id => idIndex[id];
    const getActions = action => actionIndex[action];

    const findName = name => nameIndex[name];
    const findComponent = component => componentIndex[component];

    const register = entity => {

        const {
            id,
            name,
            components = {}
        } = entity;

        if (!id) throw new Error('id is not defined');
        if (!name) throw new Error('name is not defined');
        
        idIndex[id] = entity;
        nameIndex[name] = id;

        Object.keys(components).forEach(component => {

            (componentIndex[component] ||= []).push(id);

            const { actions = {} } = components[component];
            Object.keys(actions).forEach(action => {
                (actionIndex[action] ||= []).push({id, act: actions[action]});
            })
        });
    };

    const stringify = () => JSON.stringify({idIndex, nameIndex, componentIndex, actionIndex});

    return {
        getId,
        getActions,
        findName,
        findComponent,
        register,
        stringify
    };
};