
export const useSpriteSheetRun = ({
    name,
    x = 0, 
    y = 0,
    width = 1, 
    height = 1,
    spriteCount = 1,
    fps = 0
}) => {

    if (!name) throw new Error('name is not defined');

    return {
        name,
        x, y,
        width, height,
        spriteCount,
        fps
    };
};