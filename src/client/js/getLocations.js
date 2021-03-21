import { postToBackend } from './postToBackend';

const getLocations = async (query) => {
    const base_url = 'http://localhost:3000/locations';
    try {
        return await postToBackend(base_url, { query });
    } catch (err) {
        console.error(err);
        alert('Server error. See log for details.');
    }
}

export { getLocations };