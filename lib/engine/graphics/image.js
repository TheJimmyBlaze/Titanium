
export const useImage = imagePath => {

    const image = new Image();

    const callbacks = [];
    const registerLoadEvent = callback => {

        if (image.complete) {
            callback(image);
            return;
        }
        
        callbacks.push(callback);
    };

    image.onload = () => callbacks.forEach(callback => callback(image));
    image.src = imagePath;

    return {
        image,
        complete: () => image.complete,
        registerLoadEvent
    };
};