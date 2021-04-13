// returns 'City, State(or else), Country'
const locationFullName = geoname => {
    return (({ name, countryName, adminName1 }) => ([name, adminName1, countryName].join(', ')))(geoname);
}

export { locationFullName };