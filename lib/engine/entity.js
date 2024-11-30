import { nanoid } from 'nanoid';

export const useEntity = ({
    id = nanoid(),
    components = {},
    onDeregister = null
}) => {

    return {
        id,
        components,
        onDeregister
    };
};