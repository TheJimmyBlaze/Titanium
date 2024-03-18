import { deltaTime } from "../../engine/game";

export const useMotion = ({
    velocityX = 0,
    velocityY = 0,
    acceleration = 10,
    drag = 0.2
}) => {

    const state = {
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

    const accelerateX = () => state.velocityX += state.acceleration;
    const decelerateX = () => state.velocityX -= state.acceleration;
    const accelerateY = () => state.velocityY += state.acceleration;
    const decelerateY = () => state.velocityY -= state.acceleration;

    const apply = position => {
        
        const invertedDrag = 1 - state.drag;
        state.velocityX *= invertedDrag;
        state.velocityY *= invertedDrag;

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