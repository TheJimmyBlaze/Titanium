
export const useTexture = (
    camera,
    image
) => {

    const glx = camera.canvas.glx;
    
    const texture = glx.createTexture();

    image.registerLoadEvent(image => {
        glx.bindTexture(glx.TEXTURE_2D, texture);
    
        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.CLAMP_TO_EDGE);
        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.CLAMP_TO_EDGE);
        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.NEAREST);
    
        glx.texImage2D(glx.TEXTURE_2D, 0, glx.RGBA, glx.RGBA, glx.UNSIGNED_BYTE, image);
    });

    return {
        image,
        texture
    };
};