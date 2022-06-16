import { dateString } from "./dateString";
import fetch from 'node-fetch';
import { stringifyUrl } from "query-string";

export interface ILocation {
    lat: number;
    lng: number;
    geonameId: number;
    name: string;
    adminName1: string;
    countryName: string;
}
interface IWeather {
    [k: string]: number | string | WeatherItem;
}
type WeatherItem = {
    [k: string]: number | string;
}
type WeaterAPIResponse = {
    error?: string;
    data?: any[];
}
/*--------------------API CALLS----------------------*/

// calls Geonames API, returns an array of found locations or an empty array
const fetchLocations = async (query: string, maxRows: number): Promise<ILocation[]> => {
    const base_url = 'http://api.geonames.org/searchJSON';
    const searchParams = `featureClass=P&maxRows=${maxRows}`;
    const request_url = `${base_url}?name_startsWith=${query}&${searchParams}&username=${process.env.GEO_NAME}`;
    const result = await fetch(request_url).then(res => res.json());
    // throw new Error('any') // breaks code for testing, caught is in the calling route
    if (result && result.totalResultsCount > 0) {
        return result.geonames;
    } else {
        return [];
    }
};
// calls weatherbit API Weather Forecast 16 day / daily
// returns forecast for <date>
// weatherbit returns 404 with {error: "Invalid Parameters supplied."} for badly formatted request
// rethrow it
const fetchForecast = async (lat: number, lng: number, date: string): Promise<IWeather[]> => {
    const base_url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const request_url = `${base_url}?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_KEY}`;
    const response = await fetch(request_url).then(res => res.json());
    if (response.error) {
        throw new Error(response.error)
    }
    if (!date) {
        // if date is undefined, return 1st day
        return response.data.map(({ clouds, pop, weather, precip, min_temp, max_temp }: IWeather): IWeather => ({ clouds, pop, weather, precip, min_temp, max_temp }))[0];
    }
    // else return array with 1 day
    return response.data.filter((day: IWeather) => day.valid_date === date).map(({ clouds, pop, weather, precip, min_temp, max_temp }: IWeather): IWeather => ({ clouds, pop, weather, precip, min_temp, max_temp }));

};
// calls weatherbit API Historical Weather daily
// returns forecast for <date> (Promise)
const fetchHistorical = (lat: number, lng: number, date: string): Promise<IWeather> => {
    const base_url = 'http://api.weatherbit.io/v2.0/history/daily';
    const next_day = new Date(date);
    next_day.setDate(next_day.getDate() + 1);
    const end_date = dateString(next_day);
    const request_url = `${base_url}?lat=${lat}&lon=${lng}&start_date=${date}&end_date=${end_date}&key=${process.env.WEATHERBIT_KEY}`;
    return fetch(request_url).then(res => res.json())
        .then((json) => {
            if (json.error !== undefined) {
                throw new Error(json.error);
            }
            return json.data.map(({ clouds, precip, min_temp, max_temp }: IWeather): IWeather => ({ clouds, precip, min_temp, max_temp }))
        });
};

// calls fetchHistorical to calculate average values over 5 years (max allowed by API)
const fetchHistoricalAvg = async (lat: number, lng: number, date: string): Promise<IWeather> => {
    const baseDate = new Date(date);
    let thisYear = new Date().getFullYear();
    const initialValue = { clouds: 0, precip: 0, min_temp: 0, max_temp: 0 };
    // using Promise.allSettled so that even if some requests fail, we still get our weather
    // another way is to use Promise.all and to only return data if all 5 requests were successful
    const average = await Promise.allSettled(Array(5).fill('').map(() => dateString(new Date(baseDate.setFullYear(--thisYear))))
        .map((date: string): Promise<{[k: string]: any}> => fetchHistorical(lat, lng, date)))
        .then((results) => results
            .filter((result) => result.status === 'fulfilled')
            .flatMap((result) => (result as PromiseFulfilledResult<{[k: string]: any}>).value)
            .reduce((acc, day, i, arr) => {
                return {
                    clouds: acc.clouds + day.clouds / arr.length,
                    precip: acc.precip + day.precip / arr.length,
                    min_temp: acc.min_temp + day.min_temp / arr.length,
                    max_temp: acc.max_temp + day.max_temp / arr.length
                }
            }, initialValue));
    // make sure we got data
    if (Object.keys(average).filter(key => average[key] === 0).length === 4) {
        // all values stayed at 0
        throw new Error('Weather data unavailable');
    }
    return average;
}

// calls Shutterstock API
// returns image for location 
// Pull in an image for the country from Pixabay API when the entered location brings up no results
const fetchShutter = async (name: string, country: string): Promise<string> => {
    const url = 'https://api.shutterstock.com/v2/images/search';
    const request_url = stringifyUrl({
        url,
        query: {
            image_type: 'photo',
            query: name,
            region: 'DE'
        }
    });
    let response = await fetch(request_url, {
        method: 'GET',
        headers: {
            'Authentication': `Bearer ${process.env.SHUTTERSTOCK_API_TOKEN}`
        }
    }).then(res => res.json());

    if (response.totalHits === 0) {
        throw new Error('No image found');
    }
    return response.hits[0].webformatURL;
};
// calls pixabay API
// returns image for location 
// Pull in an image for the country from Pixabay API when the entered location brings up no results
const fetchPix = async (name: string, country: string): Promise<string> => {
    const base_url = 'https://pixabay.com/api/';
    const safeName = encodeURIComponent(name);
    let request_url = `${base_url}?image_type=photo&q=${safeName}&key=${process.env.PIXABAY_KEY}`;
    let response = await fetch(request_url).then(res => res.json());
    if (response.totalHits === 0) {
        const safeName = encodeURIComponent(country);
        let request_url = `${base_url}?image_type=photo&q=${safeName}&key=${process.env.PIXABAY_KEY}`;
        response = await fetch(request_url).then(res => res.json());
        if (response.totalHits === 0) {
            throw new Error('No image found');
        }
    }
    return response.hits[0].webformatURL;
};

export {
    fetchLocations,
    fetchForecast,
    fetchHistorical,
    fetchHistoricalAvg,
    fetchPix,
    fetchShutter
}