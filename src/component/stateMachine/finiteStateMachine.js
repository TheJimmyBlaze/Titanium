
export const useFiniteStateMachine = ({
    initialState
}) => {

    const state = {
        current: initialState
    };
    const transitions = {};

    const getState = () => state.current;

    const addTransition = ({
        exitState,
        enterState,
        condition
    }) => {

        if (!condition) throw new Error('condition is not defined');

        (transitions[exitState] ||= []).push({
            enterState,
            condition
        });
    };

    const update = () => {
        state.current = transitions[state.current].find(transition => transition.condition())?.enterState || state.current;
    };

    const stringify = () => JSON.stringify(transitions);

    return {
        getState,
        addTransition,
        stringify,
        actions: {
            update
        }
    };
};