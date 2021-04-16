export interface ILocation {
    lat: number;
    lng: number;
    geonameId: number;
    name: string;
    countryName: string;
    countryCode: string;
    adminName1: string;
    locationFullName?: string;
}
type LocationKey = keyof ILocation;

export interface ICountry {
    name: string;
    currencies: {
        name: string;
        [k: string]: string;
    };
    languages: {
        name: string;
        [k: string]: string;
    };
    capital: string;
    flag: string;
}

export interface ISavedTrip {
    name: string;
    adminName1: string;
    countdown?: number;
    countryCode: string;
    countryInfo: ICountry;
    countryName: string;
    from: string;
    to: string;
    geonameId: string;
    hash: string;
    index: number;
    lat: string;
    lng: string;
    locationFullName: string;
    saved: boolean;
    submitNo: number;
    image?: string;
}