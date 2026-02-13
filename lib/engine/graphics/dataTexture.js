
export const useDataTexture = (
    camera
) => {

    const glx = camera.canvas.glx;
    
    let data = new Uint8Array();
    let width = 0;
    let height = 0;

    const texture = glx.createTexture();

    glx.bindTexture(glx.TEXTURE_2D, texture);

    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.NEAREST);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.NEAREST);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.CLAMP_TO_EDGE);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.CLAMP_TO_EDGE);

    glx.texImage2D(glx.TEXTURE_2D, 0, glx.ALPHA, 1, 1, 0, glx.RGBA, glx.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    const update = (
        newData,
        newWidth,
        newHeight
    ) => {

        if (newWidth < 0) throw new Error('newWidth cannot be smaller than 0');
        if (newHeight < 0) throw new Error('newHeight cannot be smaller than 0');
        
        data = newData;
        width = newWidth;
        height = newHeight;

        glx.bindTexture(glx.TEXTURE_2D, texture);

        const pixels = new Uint8Array(width * height * 4);
        for (let i = 0; i < width * height; i++) {
            pixels[i * 4] = newData[i]; //R, all data is stored in the red channel, G and B are currently unused
            pixels[i * 4 + 3] = 255;    //A
        }

        glx.texImage2D(glx.TEXTURE_2D, 0, glx.RGBA, width, height, 0, glx.RGBA, glx.UNSIGNED_BYTE, pixels);
    };

    return {
        getData: () => data,
        texture,
        update
    };
};