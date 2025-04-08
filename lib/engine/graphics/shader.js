
export const compileVertexShader = (glx, source) => {
    
    const vertex = glx.createShader(glx.VERTEX_SHADER);
    glx.shaderSource(vertex, source);
    glx.compileShader(vertex);

    if (!glx.getShaderParameter(vertex, glx.COMPILE_STATUS))
        throw new Error(`frame vertex shader failed to compile: ${glx.getShaderInfoLog(vertex)}`);

    return vertex;
};

export const compileFragmentShader = (glx, source) => {
    
    const fragment = glx.createShader(glx.FRAGMENT_SHADER);
    glx.shaderSource(fragment, source);
    glx.compileShader(fragment);

    if (!glx.getShaderParameter(fragment, glx.COMPILE_STATUS))
        throw new Error(`frame fragment shader failed to compile: ${glx.getShaderInfoLog(fragment)}`);

    return fragment;
}