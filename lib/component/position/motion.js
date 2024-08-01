import { deltaTime } from '../../engine/game';

export const useMotion = ({
    velocityX = 0,
    velocityY = 0,
    acceleration = 10,
    drag = 20
}) => {

    const state = {
        potentialX: 0,
        potentialY: 0,
        velocityX,
        velocityY,
        acceleration,
        drag
    };

    const getAcceleration = () => state.acceleration;
    const setAcceleration = acceleration => state.acceleration = acceleration;

    const getDrag = () => state.drag;
    const setDrag = drag => state.drag = drag;
    
    const getMotion = () => ({
        velocityX: state.velocityX, 
        velocityY: state.velocityY
    });
    const getPotential = () => ({
        potentialX: state.potentialX,
        potentialY: state.potentialY
    });

    const impulseX = impulse => state.potentialX += impulse;
    const impulseY = impulse => state.potentialY += impulse;

    const accelerateX = () => state.potentialX += state.acceleration * deltaTime();
    const decelerateX = () => state.potentialX -= state.acceleration * deltaTime();
    const accelerateY = () => state.potentialY += state.acceleration * deltaTime();
    const decelerateY = () => state.potentialY -= state.acceleration * deltaTime();

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
    };
    
    return {
        getAcceleration,
        setAcceleration,
        getDrag,
        setDrag,
        getMotion,
        getPotential,
        impulseX,
        impulseY,
        accelerateX,
        decelerateX,
        accelerateY,
        decelerateY,
        apply
    };
};