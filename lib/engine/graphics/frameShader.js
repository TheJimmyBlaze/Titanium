
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

export const useFrameShader = (
    camera,
    texture
) => {

    const glx = camera.canvas.glx;

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

    const draw = ({
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        drawX, drawY,
        drawWidth, drawHeight,
        zIndex
    }) => {

        const viewWidth = camera.getWidth() / 2;
        const viewHeight = camera.getHeight() / 2;

        const vxs = drawX / viewWidth;
        const vxe = (drawX + drawWidth) / viewWidth;
        const vys = drawY / viewHeight;
        const vye = (drawY + drawHeight) / viewHeight;

        const positions = [
            vxs, -vye,
            vxe, -vye,
            vxe, -vys,
            vxs, -vys
        ];

        glx.bindBuffer(glx.ARRAY_BUFFER, positionBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(positions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aPosition, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aPosition);

        const imageWidth = texture.image.image.width;
        const imageHeight = texture.image.image.height;

        const txs = frameX / imageWidth;
        const txe = (frameX + frameWidth) / imageWidth;
        const tys = frameY / imageHeight;
        const tye = (frameY  + frameHeight) / imageHeight;

        const texPositions = [
            txs, tye,
            txe, tye,
            txe, tys,
            txs, tys
        ];
    
        glx.bindBuffer(glx.ARRAY_BUFFER, textCoordBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(texPositions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aTexCoord, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aTexCoord);

        glx.bindBuffer(glx.ARRAY_BUFFER, textCoordBuffer);
        glx.bindTexture(glx.TEXTURE_2D, texture.texture)

        glx.useProgram(program);
        glx.drawArrays(glx.TRIANGLE_FAN, 0, 4);
    };

    return {
        draw
    };
};