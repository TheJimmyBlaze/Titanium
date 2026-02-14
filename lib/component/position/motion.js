import { deltaTime } from '../../engine/game';

export const useMotion = ({
    potentialX = 0,
    potentialY = 0,
    velocityX = 0,
    velocityY = 0,
    acceleration = 10,
    accelerationX = undefined,
    accelerationY = undefined,
    drag = 20,
    dragX = undefined,
    dragY = undefined,
    spin = 0,
    spinDrag = 20
} = {}) => {

    const state = {
        potentialX,
        potentialY,
        velocityX,
        velocityY,
        accelerationX: accelerationX ?? acceleration,
        accelerationY: accelerationY ?? acceleration,
        dragX: dragX ?? drag,
        dragY: dragY ?? drag,
        spin,
        spinDrag
    };

    const pack = () => ({
        velocityX: Math.floor((state.velocityX + state.potentialX) * 100) / 100,
        velocityY: Math.floor((state.velocityY + state.potentialY) * 100) / 100
    });
    const unpack = ({velocityX, velocityY}) => {
        state.velocityX = velocityX;
        state.velocityY = velocityY;
    };

    const clone = ({
        potentialX = state.potentialX,
        potentialY = state.potentialY,
        velocityX = state.velocityX,
        velocityY = state.velocityY,
        accelerationX = state.accelerationX,
        accelerationY = state.accelerationY,
        dragX = state.dragX,
        dragY = state.dragY,
        spin = state.spin,
        spinDrag = state.spinDrag
    } = {}) => useMotion({
        potentialX, potentialY,
        velocityX, velocityY,
        accelerationX, accelerationY,
        dragX, dragY,
        spin, spinDrag
    });

    const getAcceleration = () => { return { x: state.accelerationX, y: state.accelerationY}; }
    const setAcceleration = (x, y) => { state.accelerationX = x; state.accelerationY = y; }

    const getDrag = () => { return { x: state.dragX, y: state.dragY }; }
    const setDrag = (x, y) => { state.dragX = x; state.dragY = y; }

    const getSpin = () => state.spin;
    const setSpin = spin => state.spin = spin;

    const getSpinDrag = () => state.spinDrag;
    const setSpinDrag = drag => state.spinDrag = drag;
    
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

    const accelerateX = () => state.potentialX += state.accelerationX * deltaTime();
    const decelerateX = () => state.potentialX -= state.accelerationX * deltaTime();
    const accelerateY = () => state.potentialY += state.accelerationY * deltaTime();
    const decelerateY = () => state.potentialY -= state.accelerationY * deltaTime();

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
        const invertedDragX = 1 - state.dragX * deltaTime();
        let velocityX = state.velocityX * invertedDragX;
        const invertedDragY = 1 - state.dragY * deltaTime();
        let velocityY = state.velocityY * invertedDragY;

        //Apply velocity
        velocityX += potentialX;
        velocityY += potentialY;
        const deltaX = velocityX * deltaTime();
        const deltaY = velocityY * deltaTime();

        //Apply spin
        const invertedSpinDrag = 1 - state.spinDrag * deltaTime();
        let spin = state.spin * invertedSpinDrag;
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
        unpack,
        clone,
        getAcceleration,
        setAcceleration,
        getDrag,
        setDrag,
        getSpin,
        setSpin,
        getSpinDrag,
        setSpinDrag,
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