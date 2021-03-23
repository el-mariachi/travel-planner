// returns 'City, State(or else), Country'
const locationFullName = geoname => {
    const picked = (({ name, countryName, adminName1 }) => ({ name, countryName, adminName1 }))(geoname);
    return `${picked.name}, ${picked.adminName1}, ${picked.countryName}`;
}

export { locationFullName };