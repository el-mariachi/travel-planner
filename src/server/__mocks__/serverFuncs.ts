const fetchLocations = (query: string, maxRows: number) => {
    if (!query) {
        throw new Error('empty');
    }
    return Array(maxRows).fill({ name: query });
};

const fetchForecast = (lat: number, lng: number, from: string) => {
    if (!lat || !lng) {
        throw new Error('empty');
    }
    const dummy = { clouds: 0, pop: 0, weather: 0, precip: 0, min_temp: 0, max_temp: 0 };
    return Array(16).fill(dummy);
};

const fetchHistorical = (lat: number, lng: number, from: string) => {
    if (!lat || !lng || !from) {
        throw new Error('empty');
    }
    return [{ clouds: 0, precip: 0, min_temp: 0, max_temp: 0 }];
};

const fetchHistoricalAvg = (lat: number, lng: number, from: string) => {
    if (!lat || !lng || !from) {
        throw new Error('empty');
    }
    return { clouds: 0, precip: 0, min_temp: 0, max_temp: 0 };
};

const fetchPix = (name: string, country: string) => {
    if (!name) {
        throw new Error('empty');
    }
    return name;
};

module.exports = {
    fetchLocations,
    fetchForecast,
    fetchHistorical,
    fetchHistoricalAvg,
    fetchPix
}