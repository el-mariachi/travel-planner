const getLocations = jest.fn(() => Promise.resolve(Array(4).fill('whatever')));

export {
    getLocations
}