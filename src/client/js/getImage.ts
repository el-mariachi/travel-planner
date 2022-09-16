import { postToBackend } from './postToBackend';
import { apiUrlNetlify } from "./api-url-netlify";

const getImage = (name: string, country: string, submitNo: number): Promise<{[k: string]: any}> => {
    const endpoint = `${apiUrlNetlify}/api/pix`;
    return new Promise((res, rej) => {
        postToBackend(endpoint, { name, country, submitNo })
            .then(result => res(result))
            .catch(err => {
                console.error(err);
                alert('Server error. See log for details.');
                rej(err)
            });
    });

}

export { getImage };