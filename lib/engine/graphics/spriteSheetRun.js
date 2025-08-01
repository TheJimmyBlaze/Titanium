
export const useSpriteSheetRun = ({
    name = null,
    x = 0, 
    y = 0,
    width = 1, 
    height = 1,
    spriteCount = 1,
    fps = 0
} = {}) => {

    return {
        name,
        x, y,
        width, height,
        spriteCount,
        fps
    };
};