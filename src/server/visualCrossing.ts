import axios from 'axios';

interface IWeather {
    [k: string]: number | string | WeatherItem;
}
type WeatherItem = {
    [k: string]: number | string;
}

const timelineRequest = async (lat: number, lng: number, date: string): Promise<IWeather[]> => {
    const base_url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    const location = encodeURIComponent(`${lat},${lng}`);
    const typeOption = 'json';
    const unitOption = 'metric';
    const iconsOption = 'icons2';
    const includeOption = encodeURIComponent('days');
    const elementsOption = encodeURIComponent('cloudcover,conditions,description,tempmax,tempmin,temp,icon,precip,source');
    const apiKeyOption = `${process.env.VC_WEATHER_KEY}`;
    const request = `${base_url}${location}/${date}/${date}?contentType=${typeOption}&unitGroup=${unitOption}&include=${includeOption}&elements=${elementsOption}&key=${apiKeyOption}&iconSet=${iconsOption}`;
    
    const response = await axios.get(request)
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Network request to weather API failed');
            }
            return response.data;
        });
    if (response.errorCode) {
        throw new Error(response.message);
    }
    return response.days;
};

export {
    timelineRequest
}