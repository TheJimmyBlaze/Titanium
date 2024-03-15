import { nanoid } from 'nanoid';

export const Registry = () => {

    const idIndex = {};
    const priorityIndex = {};
    const tagIndex = {};
    const propertyIndex = {};
    const propertyTagIndex = {};

    const getAll = () => Object.values(priorityIndex).map(prio => Object.values(prio)).flat().map(entry => entry.entity);

    const register = ({
        entity,
        tags = [],
        priority = 0
    }) => {

        if (tags.length === 0) {
            tags = ['untagged'];
        };
        
        const id = nanoid();
        const entry = {
            id,
            entity,
            tags,
            priority
        };

        idIndex[id] = entry;
        
        //Push to priority array
        (priorityIndex[priority] ||= {})[id] = entry;       //This should insert in sorted order

        //Push to tag array
        tags.forEach(tag => (tagIndex[tag] ||= []).push(id));

        const properties = Object.keys(entity);
        properties.forEach(prop => {

            //Push to properties array
            (propertyIndex[prop] ||= []).push(id);

            //Push to property tag array
            const entry = propertyTagIndex[prop] ||= {};
            tags.forEach(tag => (entry[tag] ||= []).push(id));
        });

        console.log('\n');
        console.log(`id: ${JSON.stringify(idIndex)}`);
        console.log(`prio: ${JSON.stringify(priorityIndex)}`);
        console.log(`tag: ${JSON.stringify(tagIndex)}`);
        console.log(`prop: ${JSON.stringify(propertyIndex)}`);
        console.log(`proTag: ${JSON.stringify(propertyTagIndex)}`);
        console.log('\n');
    };

    return {
        getAll,
        register
    };
};