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

    const accelerateX = () => state.potentialX += state.acceleration;
    const decelerateX = () => state.potentialX -= state.acceleration;
    const accelerateY = () => state.potentialY += state.acceleration;
    const decelerateY = () => state.potentialY -= state.acceleration;

    const apply = position => {

        //Share potential velocity
        if (
            Math.abs(state.potentialX) > 0.1 && 
            Math.abs(state.potentialY) > 0.1
        ) {
            state.potentialX *= 0.75;
            state.potentialY *= 0.75;
        }
        
        state.velocityX += state.potentialX;
        state.velocityY += state.potentialY;
        state.potentialX = 0;
        state.potentialY = 0;
        
        //Apply drag
        const invertedDrag = 1 - state.drag;
        state.velocityX *= invertedDrag;
        state.velocityY *= invertedDrag;

        //Apply velocity
        const deltaX = state.velocityX * deltaTime();
        const deltaY = state.velocityY * deltaTime();
        position.move(deltaX, deltaY);
    };
    
    return {
        getAcceleration,
        setAcceleration,
        getDrag,
        setDrag,
        getMotion,
        accelerateX,
        decelerateX,
        accelerateY,
        decelerateY,
        apply
    };
};