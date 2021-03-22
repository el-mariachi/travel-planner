import { postToBackend } from './postToBackend';

const getLocations = (query) => {
    const base_url = 'http://localhost:3000/locations';

    return new Promise((res, rej) => {
        postToBackend(base_url, { query })
            .then(result => res(result))
            .catch(err => {
                console.error(err);
                alert('Server error. See log for details.');
                rej(err)
            });
    });

}

export { getLocations };