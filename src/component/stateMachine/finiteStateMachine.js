
export const useFiniteStateMachine = ({
    initialState
}) => {

    const state = {
        current: initialState
    };
    const transitions = {};

    const getCurrentState = () => state.current;

    const addTransition = ({
        exitState,
        enterState,
        condition
    }) => {

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
        getCurrentState,
        addTransition,
        stringify,
        actions: {
            update
        }
    };
};