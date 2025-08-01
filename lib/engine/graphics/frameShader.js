
import { compileFragmentShader, compileVertexShader } from './shader';

const frameVertexShader = `
precision lowp float;

attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_origin;
uniform vec2 u_reflection;

attribute vec2 a_texCoord;
uniform vec2 u_texResolution;
uniform vec2 u_texTranslation;

varying vec2 v_texCoord;

void main() {

    vec2 origin = a_position - u_origin;

    vec2 rotate = vec2(
        origin.x * u_rotation.y + origin.y * u_rotation.x,
        origin.y * u_rotation.y - origin.x * u_rotation.x
    );

    vec2 reflect = rotate * u_reflection;
    vec2 position = reflect + u_origin + u_translation;

    vec2 zeroToOne = position / u_resolution;
    gl_Position = vec4(zeroToOne, 0.0, 1.0);

    vec2 texPosition = a_texCoord + u_texTranslation + vec2(0.05, 0.0);
    vec2 texZeroToOne = texPosition / u_texResolution;
    v_texCoord = texZeroToOne;
}`;

const frameFragmentShader = `
precision lowp float;

uniform sampler2D u_texture;
uniform float u_opacity;

varying vec2 v_texCoord;

void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
    gl_FragColor.a = min(gl_FragColor.a, u_opacity);
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
    const uReflection = glx.getUniformLocation(program, "u_reflection");
    
    const aTexCoord = glx.getAttribLocation(program, 'a_texCoord');
    const texCoordBuffer = glx.createBuffer();

    const uTexResolution = glx.getUniformLocation(program, "u_texResolution");
    const uTexTranslation = glx.getUniformLocation(program, "u_texTranslation");

    const uOpacity = glx.getUniformLocation(program, "u_opacity");

    const draw = ({
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        drawX, drawY,
        drawWidth, drawHeight,
        rotation,
        centerX, centerY,
        mirror,
        flip,
        opacity
    }) => {

        glx.useProgram(program);

        //Position
        const positions = [
            0, 0,
            drawWidth, 0,
            drawWidth, drawHeight,
            0, drawHeight
        ];

        glx.bindBuffer(glx.ARRAY_BUFFER, positionBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(positions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aPosition, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aPosition);

        //Resolution
        const viewWidth = camera.getWidth() / 2;
        const viewHeight = -camera.getHeight() / 2;
        const resolutionVector = [viewWidth, viewHeight];
        glx.uniform2fv(uResolution, resolutionVector);

        //Translation
        const {x: cameraX, y: cameraY} = camera.position.getPosition();
        const shiftX = drawX - cameraX;
        const shiftY = drawY - cameraY;
        const translationVector = [shiftX, shiftY];
        glx.uniform2fv(uTranslation, translationVector);

        //Rotation
        const radians = -rotation * Math.PI / 180;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        const rotationVector = [sin, cos];
        glx.uniform2fv(uRotation, rotationVector);

        //Rotation origin
        const originX = centerX;
        const originY = centerY;
        const originVector = [originX, originY];
        glx.uniform2fv(uOrigin, originVector);

        //Reflection
        const reflectX = mirror ? -1 : 1;
        const reflectY = flip ? -1 : 1;
        const reflectVector = [reflectX, reflectY];
        glx.uniform2fv(uReflection, reflectVector);

        //Texture
        const texPositions = [
            0, 0,
            frameWidth, 0,
            frameWidth, frameHeight,
            0, frameHeight
        ];
    
        glx.bindBuffer(glx.ARRAY_BUFFER, texCoordBuffer);
        glx.bufferData(glx.ARRAY_BUFFER, new Float32Array(texPositions), glx.STATIC_DRAW);
        glx.vertexAttribPointer(aTexCoord, 2, glx.FLOAT, false, 0, 0);
        glx.enableVertexAttribArray(aTexCoord);

        glx.bindBuffer(glx.ARRAY_BUFFER, texCoordBuffer);
        glx.bindTexture(glx.TEXTURE_2D, texture.texture);

        //Texture resolution
        const imageWidth = texture.image.image.width;
        const imageHeight = texture.image.image.height;
        const textureResolutionVector = [imageWidth, imageHeight];
        glx.uniform2fv(uTexResolution, textureResolutionVector);

        //Texture translation
        const textureTranslationVector = [frameX, frameY];
        glx.uniform2fv(uTexTranslation, textureTranslationVector);

        //Opacity
        glx.uniform1f(uOpacity, opacity);

        glx.drawArrays(glx.TRIANGLE_FAN, 0, 4);
    };

    return {
        draw
    };
};