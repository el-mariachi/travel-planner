/**
 * Returns a function that returns a promise.
 * No need to catch rejection inside this function.
 */
const postToBackend = (url = '', data = {}) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            return res.json();
        });
};

export { postToBackend };