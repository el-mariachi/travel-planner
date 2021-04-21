// returns a debounced version of an async function
export function debounceAsync<T>(func: Function, ms: number = 500) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: T[]): Promise<any> {
        clearTimeout(timeout);
        return new Promise((res, rej) => {
            timeout = setTimeout(() => res(func.apply(this, args)), ms);
        });
    };
}