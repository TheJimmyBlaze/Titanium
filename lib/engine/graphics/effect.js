import { nanoid } from 'nanoid';

export const useEffect = ({
    id = nanoid(),
    apply,
}) => {

    return {
        id,
        apply
    };
};