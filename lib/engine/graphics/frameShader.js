
import { compileFragmentShader, compileVertexShader } from './shader';

const frameVertexShader = `

attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_origin;

attribute vec2 a_texcoord;
varying vec2 v_texcoord;

void main() {

    vec2 rotationOrigin = a_position - u_origin;
    vec2 rotatedPosition = vec2(
        rotationOrigin.x * u_rotation.y + rotationOrigin.y * u_rotation.x,
        rotationOrigin.y * u_rotation.y - rotationOrigin.x * u_rotation.x
    );

    vec2 position = rotatedPosition + u_origin + u_translation;

    vec2 zeroToOne = position / u_resolution;
    gl_Position = vec4(zeroToOne, 0.0, 1.0);
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

    const uResolution = glx.getUniformLocation(program, "u_resolution");
    const uTranslation = glx.getUniformLocation(program, "u_translation");
    const uRotation = glx.getUniformLocation(program, "u_rotation");
    const uOrigin = glx.getUniformLocation(program, "u_origin");
    
    const aTexCoord = glx.getAttribLocation(program, 'a_texcoord');
    const textCoordBuffer = glx.createBuffer();

    const draw = ({
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        drawX, drawY,
        drawWidth, drawHeight,
        rotation,
        centerX, centerY
    }) => {

        glx.useProgram(program);

        //Vertex position
        const positions = [

            0, 0,
            drawWidth, 0,
            drawWidth, drawHeight,
            0, drawHeight

            // 0, 0,
            // width, 0,
            // 0, height,

            // 0, height,
            // width, height,
            // width, 0
        ];

        glx.bindBuffer(glx.ARRAY_BUFFER, positionBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(positions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aPosition, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aPosition);

        //Vertex resolution
        const viewWidth = camera.getWidth() / 2;
        const viewHeight = -camera.getHeight() / 2;
        const resolutionVector = [viewWidth, viewHeight];
        glx.uniform2fv(uResolution, resolutionVector);

        //Vertex translation
        const shiftX = drawX;
        const shiftY = drawY;
        const translationVector = [shiftX, shiftY];
        glx.uniform2fv(uTranslation, translationVector);

        //Vertex rotation
        const radians = -rotation * Math.PI / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        const rotationVector = [sin, cos];
        glx.uniform2fv(uRotation, rotationVector);

        //Vertex rotation origin
        const originX = centerX;
        const originY = centerY;
        const originVector = [originX, originY];
        glx.uniform2fv(uOrigin, originVector);

        //Fragment Texture
        const imageWidth = texture.image.image.width;
        const imageHeight = texture.image.image.height;

        const txs = frameX / imageWidth;
        const txe = (frameX + frameWidth) / imageWidth;
        const tys = frameY / imageHeight;
        const tye = (frameY  + frameHeight) / imageHeight;

        const texPositions = [

            txs, tys,
            txe, tys,
            txe, tye,
            txs, tye

            // txs, tys,
            // txe, tys,
            // txs, tye,

            // txs, tye,
            // txe, tye,
            // txe, tys
        ];
    
        glx.bindBuffer(glx.ARRAY_BUFFER, textCoordBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(texPositions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aTexCoord, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aTexCoord);

        glx.bindBuffer(glx.ARRAY_BUFFER, textCoordBuffer);
        glx.bindTexture(glx.TEXTURE_2D, texture.texture);

        glx.drawArrays(glx.TRIANGLE_FAN, 0, 4);
    };

    return {
        draw
    };
};