import { postToBackend } from './postToBackend';

const getWeather = (url, data) => {
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