
export const useDataTexture = (
    camera,
    initialData
) => {

    const glx = camera.canvas.glx;
    
    let data = initialData;
    const texture = glx.createTexture();

    glx.bindTexture(glx.TEXTURE_2D, texture);

    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.NEAREST);
    glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.NEAREST);

    glx.texImage2D(glx.TEXTURE_2D, 0, glx.ALPHA, data.length, 1, 0, glx.ALPHA, glx.FLOAT, data);

    const update = newData => {
        
        data = newData;
        glx.bindTexture(glx.TEXTURE_2D, texture);

        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.NEAREST);
        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.NEAREST);

        glx.texImage2D(glx.TEXTURE_2D, 0, glx.ALPHA, newData.length, 1, 0, glx.ALPHA, glx.FLOAT, newData);
    };

    return {
        getData: () => data,
        texture,
        update
    };
};