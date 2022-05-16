export const getWeather = jest.fn((route, locationData) => {
    const { lat, lng, from, submitNo } = locationData;
    return Promise.resolve({
        submitNo,
        clouds: 5,
        precip: 15,
        min_temp: 12,
        max_temp: 18
    });
});