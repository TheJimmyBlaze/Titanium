import { deltaTime } from '../../engine/game';

export const useMotion = ({
    potentialX = 0,
    potentialY = 0,
    velocityX = 0,
    velocityY = 0,
    acceleration = 10,
    drag = 20,
    spin = 0
} = {}) => {

    const state = {
        potentialX,
        potentialY,
        velocityX,
        velocityY,
        acceleration,
        drag,
        spin
    };
    const pack = () => state;

    const clone = ({
        potentialX = state.potentialX,
        potentialY = state.potentialY,
        velocityX = state.velocityX,
        velocityY = state.velocityY,
        acceleration = state.acceleration,
        drag = state.drag,
        spin = state.spin
    } = {}) => useMotion({
        potentialX, potentialY,
        velocityX, velocityY,
        acceleration,
        drag,
        spin
    });

    const getAcceleration = () => state.acceleration;
    const setAcceleration = acceleration => state.acceleration = acceleration;

    const getDrag = () => state.drag;
    const setDrag = drag => state.drag = drag;

    const getSpin = () => state.spin;
    const setSpin = spin => state.spin = spin;
    
    const getMotion = () => ({
        velocity: Math.sqrt(Math.pow(Math.abs(state.velocityX), 2) + Math.pow(Math.abs(state.velocityY), 2)),
        velocityX: state.velocityX, 
        velocityY: state.velocityY
    });
    const setMotion = (x, y) => {
        state.velocityX = x;
        state.velocityY = y;
    };

    const getPotential = () => ({
        potentialX: state.potentialX,
        potentialY: state.potentialY
    });
    const setPotential = (x, y) => {
        state.potentialX = x,
        state.potentialY = y;
    };

    const impulseX = impulse => state.potentialX += impulse;
    const impulseY = impulse => state.potentialY += impulse;
    const impulseSpin = impulse => state.spin += impulse;

    const accelerateX = () => state.potentialX += state.acceleration * deltaTime();
    const decelerateX = () => state.potentialX -= state.acceleration * deltaTime();
    const accelerateY = () => state.potentialY += state.acceleration * deltaTime();
    const decelerateY = () => state.potentialY -= state.acceleration * deltaTime();

    const stop = () => {
        state.potentialX = 0;
        state.potentialY = 0;
        state.velocityX = 0;
        state.velocityY = 0;
    };

    const apply = (position, virtual = false) => {

        //Share potential velocity
        let potentialX = state.potentialX;
        let potentialY = state.potentialY;

        if (
            Math.abs(potentialX) > 0.1 && 
            Math.abs(potentialY) > 0.1
        ) {
            potentialX *= 0.75;
            potentialY *= 0.75;
        }
        
        //Apply drag
        const invertedDrag = 1 - state.drag * deltaTime();
        let velocityX = state.velocityX * invertedDrag;
        let velocityY = state.velocityY * invertedDrag;

        //Apply velocity
        velocityX += potentialX;
        velocityY += potentialY;
        const deltaX = velocityX * deltaTime();
        const deltaY = velocityY * deltaTime();

        //Apply spin
        let spin = state.spin * invertedDrag;
        const deltaSpin = spin * deltaTime();
        position.lerpRotate(deltaSpin, 0.0001);

        //If virtual return moved clone
        if (virtual) {
            const clone = position.copy();
            clone.move(deltaX, deltaY)
            return clone;
        }

        //If not virtual commit move to state    
        position.move(deltaX, deltaY);

        state.potentialX = 0;
        state.potentialY = 0;
        state.velocityX = velocityX;
        state.velocityY = velocityY;
        state.spin = spin;
    };
    
    return {
        pack,
        clone,
        getAcceleration,
        setAcceleration,
        getDrag,
        setDrag,
        getSpin,
        setSpin,
        getMotion,
        setMotion,
        getPotential,
        setPotential,
        impulseX,
        impulseY,
        impulseSpin,
        accelerateX,
        decelerateX,
        accelerateY,
        decelerateY,
        stop,
        apply
    };
};