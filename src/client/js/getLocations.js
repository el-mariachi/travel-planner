import { postToBackend } from './postToBackend';

const getLocations = async (query) => {
    let response;
    const base_url = 'http://localhost:3000/locations';
    try {
        response = await postToBackend(base_url, { query });
        console.log('getLocations response:', response);
    } catch (err) {
        console.error(err);
        alert('Server error. See log for details.');
    }
}

export { getLocations };