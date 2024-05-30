import { nanoid } from 'nanoid';

export const useEntity = ({
    id = nanoid(),
    components = []
}) => {

    return {
        id,
        components
    };
};