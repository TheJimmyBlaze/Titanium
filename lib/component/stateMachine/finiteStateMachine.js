
export const useFiniteStateMachine = ({
    initialState
}) => {

    const state = {
        current: initialState
    };
    const transitions = {};

    const getState = () => state.current;
    const setState = next => state.current = next;

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

    const findTransition = () => transitions[state.current]?.find(transition => transition.condition());

    const update = () => {
        
        for(let candidate = findTransition(); candidate; candidate = findTransition()) {
            state.current = candidate.enterState;
        }
    };

    const stringify = () => JSON.stringify(transitions);

    return {
        getState,
        setState,
        addTransition,
        stringify,
        actions: {
            update
        }
    };
};