import { nanoid } from 'nanoid';

export const Registry = () => {

    const idIndex = {};

    const tagIndex = {};
    const propertyIndex = {};
    const propertyTagIndex = {};

    const get = id => idIndex[id];

    const all = () => Object.values(idIndex);

    const tag = tag => tagIndex[tag];
    const find = property => propertyIndex[property];
    const findTag = (property, tag) => propertyTagIndex[property][tag];

    const register = ({
        entity,
        tags = [],
    }) => {

        if (tags.length === 0) {
            tags = ['untagged'];
        };
        
        const id = nanoid();
        idIndex[id] = entity;

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
    };

    return {
        get,
        all,
        tag,
        find,
        findTag,
        register
    };
};