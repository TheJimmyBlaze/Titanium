
import { compileFragmentShader, compileVertexShader } from './shader';

const frameVertexShader = `

attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texcoord = a_texcoord;
}`;

const frameFragmentShader = `

precision lowp float;

uniform sampler2D u_texture;

varying vec2 v_texcoord;

void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
}`;

export const useFrameShader = ({
    drawCamera
}) => {

    const glx = drawCamera.canvas.glx;

    const frameVertex = compileVertexShader(glx, frameVertexShader);
    const frameFragment = compileFragmentShader(glx, frameFragmentShader);

    const program = glx.createProgram();
    glx.attachShader(program, frameVertex);
    glx.attachShader(program, frameFragment);
    glx.linkProgram(program);
    
    const aPosition = glx.getAttribLocation(program, 'a_position');
    const positionBuffer = glx.createBuffer();

    const aTexCoord = glx.getAttribLocation(program, 'a_texcoord');
    const textCoordBuffer = glx.createBuffer();

    const texture = glx.createTexture();

    const draw = ({
        image,
        rotation,
        mirror,
        flip,
        opacity,
        drawX, drawY,
        drawWidth, drawHeight,
        centerX, centerY,
        zIndex
    }) => {

        const viewWidth = drawCamera.getWidth() / 2;
        const viewHeight = drawCamera.getHeight() / 2;

        const xs = drawX / viewWidth;
        const xe = (drawX + drawWidth) / viewWidth;
        const ys = drawY / viewHeight;
        const ye = (drawY + drawHeight) / viewHeight;

        const positions = [
            xs, -ye,
            xe, -ye,
            xe, -ys,
            xs, -ys
        ];

        glx.bindBuffer(glx.ARRAY_BUFFER, positionBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(positions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aPosition, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aPosition);

        const texPositions = [
            -1.0, 1.0,
            1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0
        ];

        glx.bindBuffer(glx.ARRAY_BUFFER, textCoordBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(texPositions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aTexCoord, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aTexCoord);

        glx.bindTexture(glx.TEXTURE_2D, texture);

        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.CLAMP_TO_EDGE);
        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.CLAMP_TO_EDGE);
        glx.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.LINEAR);

        glx.texImage2D(glx.TEXTURE_2D, 0, glx.RGBA, glx.RGBA, glx.UNSIGNED_BYTE, image);

        glx.useProgram(program);
        glx.drawArrays(glx.TRIANGLE_FAN, 0, 4);
    };

    return {
        draw
    };
};