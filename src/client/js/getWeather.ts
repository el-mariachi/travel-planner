import { postToBackend } from './postToBackend';

const getWeather = (url: string, data: {[k: string]: any}): Promise<{[k: string]: any}> => {
    return new Promise((res, rej) => {
        postToBackend(url, data)
            .then(result => res(result))
            .catch(err => {
                console.error(err);
                alert('Server error. See log for details.');
                rej(err)
            });
    });

}

export { getWeather };