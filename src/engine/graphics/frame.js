import { useSpriteOptions } from './spriteOptions';

export const useFrame = ({
    image,
    frameWidth,
    frameHeight,
    x, y,
    framesWide = 1,
    framesHigh = 1
}) => {

    if (!image) throw new Error('image is not defined');
    if (frameWidth == null) throw new Error('frameWidth cannot be null');
    if (frameHeight == null) throw new Error('frameHeight cannot be null');
    if (x == null) throw new Error('x cannot be null');
    if (y == null) throw new Error('y cannot be null');

    const frameX = x * frameWidth;
    const frameY = y * frameHeight;

    const draw = (
        x, 
        y, 
        camera, 
        options = useSpriteOptions({})
    ) => {

        const {
            offsetX,
            offsetY,
            width,
            height,
            rotation,
            invert,
            flip,
            crop,
            zIndex,
            opacity
        } = options.getOptions();

        let drawWidth = width || frameWidth;
        let drawHeight = height || frameHeight;

        let drawX = x - drawWidth / 2 - offsetX;
        let drawY = y - drawHeight / 2 - offsetY;
        
        const centerX = drawX + drawWidth / 2 + offsetX;
        const centerY = drawY + drawHeight / 2 + offsetY;

        if (crop) {
            drawX += crop.x || 0,
            drawY += crop.y || 0,
            drawWidth -= crop.width || 0,
            drawHeight -= crop.height || 0
        };

        camera.requestDraw(
            ctx => {

                if (rotation || flip || invert) {

                    ctx.save();

                    ctx.translate(centerX, centerY);
                    
                    if (rotation) ctx.rotate((rotation * Math.PI) / 180);
                    if (flip || invert) ctx.scale(-1 * flip || 1, -1 * invert || 1);
        
                    ctx.translate(-centerX, -centerY);
                }
                
                const preAlpha = ctx.globalAlpha;
                ctx.globalAlpha = opacity;
                ctx.drawImage(
                    image, 
                    frameX, 
                    frameY, 
                    frameWidth * framesWide, 
                    frameHeight * framesHigh, 
                    drawX,
                    drawY,
                    drawWidth * framesWide,
                    drawHeight * framesHigh
                );
                ctx.globalAlpha = preAlpha;

                if (rotation || flip || invert) ctx.restore();
            },
            zIndex
        );
    };
    
    return {
        draw
    };
};