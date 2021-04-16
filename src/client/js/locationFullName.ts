import { ILocation } from "./types";
// returns 'City, State(or else), Country'
const locationFullName = (geoname: ILocation): string => {
    return (({ name, countryName, adminName1 }) => ([name, adminName1, countryName].join(', ')))(geoname);
}

export { locationFullName };