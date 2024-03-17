import { nanoid } from "nanoid";

export const useEntity = ({
    name,
    components = []
}) => {

    return {
        id: nanoid(),
        name,
        components
    };
};