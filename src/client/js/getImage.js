import { postToBackend } from './postToBackend';

const getImage = (name, country, submitNo) => {
    const endpoint = '/api/pix'
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