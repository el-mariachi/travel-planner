// returns a debounced version of a function
export function debounce<T>(func: Function, ms = 500): Function {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: T[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), ms);
    };
}