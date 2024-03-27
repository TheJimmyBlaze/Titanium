import { deltaTime } from "../../engine/game";

export const useMotion = ({
    velocityX = 0,
    velocityY = 0,
    acceleration = 10,
    drag = 0.2
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

    const stop = () => {
        state.potentialX = 0;
        state.potentialY = 0;
        state.velocityX = 0;
        state.velocityY = 0;
    };

    const accelerateX = () => state.potentialX += state.acceleration;
    const decelerateX = () => state.potentialX -= state.acceleration;
    const accelerateY = () => state.potentialY += state.acceleration;
    const decelerateY = () => state.potentialY -= state.acceleration;

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
        
        let velocityX = state.velocityX + potentialX;
        let velocityY = state.velocityY + potentialY;
        
        //Apply drag
        const invertedDrag = 1 - state.drag;
        velocityX *= invertedDrag;
        velocityY *= invertedDrag;

        //Apply velocity
        const deltaX = velocityX * deltaTime();
        const deltaY = velocityY * deltaTime();
        position.move(deltaX, deltaY);

        //Commit changes to state if not virtual
        if (!virtual) {
            state.potentialX = 0;
            state.potentialY = 0;
            state.velocityX = velocityX;
            state.velocityY = velocityY;
        }
    };
    
    return {
        getAcceleration,
        setAcceleration,
        getDrag,
        setDrag,
        getMotion,
        getPotential,
        stop,
        accelerateX,
        decelerateX,
        accelerateY,
        decelerateY,
        apply
    };
};