import { postToBackend } from './postToBackend';
import { ILocation } from "./types";
import { apiUrlNetlify } from "./api-url-netlify";

const getLocations = (query: string, maxRows = 30): Promise<ILocation[]> => {
    const base_url = `${apiUrlNetlify}/api/locations`;

    return new Promise((res, rej) => {
        postToBackend(base_url, { query, maxRows })
            .then(result => res(result))
            .catch(err => {
                console.error(err);
                alert('Server error. See log for details.');
                rej(err)
            });
    });

}

export { getLocations };