
export const useSpriteOptions = ({
    offsetX = 0,
    offsetY = 0,
    rotation = 0,
    reverse = false,
    invert = false,
    flip = false,
    crop = null,
    zIndex = 0,
    opacity = 1
}) => {

    const state = {
        offsetX,
        offsetY,
        rotation,
        reverse,
        invert,
        flip,
        crop,
        zIndex,
        opacity
    };

    const getOptions = () => state;

    const getOffsetX = () => state.offsetX;
    const setOffsetX = value => state.offsetX = value;

    const getOffsetY = () => state.offsetY;
    const setOffsetY = value => state.offsetY = value;

    const getRotation = () => state.rotation;
    const setRotation = value => state.rotation = value;

    const getReverse = () => state.reverse;
    const setReverse = value => state.reverse = value;

    const getInvert = () => state.invert;
    const setInvert = value => state.invert = value;

    const getFlip = () => state.flip;
    const setFlip = value => state.flip = value;

    const getCrop = () => state.crop;
    const setCrop = value => state.crop = value;

    const getZIndex = () => state.zIndex;
    const setZIndex = value => state.zIndex = value;

    const getOpacity = () => state.opacity;
    const setOpacity = value => state.opacity = value;

    return {
        getOptions,
        getOffsetX,
        setOffsetX,
        getOffsetY,
        setOffsetY,
        getRotation,
        setRotation,
        getReverse,
        setReverse,
        getInvert,
        setInvert,
        getFlip,
        setFlip,
        getCrop,
        setCrop,
        getZIndex,
        setZIndex,
        getOpacity,
        setOpacity
    };
};