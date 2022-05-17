import { postToBackend } from './postToBackend';
import { IWeatherRequestData } from './types';

const getWeather = (url: string, data: IWeatherRequestData): Promise<{[k: string]: any}> => {
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