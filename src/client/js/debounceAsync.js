// returns a debounced version of an async function
export function debounceAsync(func, ms) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        return new Promise((res, rej) => {
            timeout = setTimeout(() => res(func.apply(this, arguments)), ms);
        });
    };
}