import { nanoid } from "nanoid";

export const useEntity = ({
    components = []
}) => {

    return {
        id: nanoid(),
        components
    };
};