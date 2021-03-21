const suggestionsHTML = data => {
    return data.map(geoname => {
        const adminName = geoname.adminName1 ? `, ${geoname.adminName1}` : '';
        const displayName = `${geoname.name}${adminName}, ${geoname.countryName}`;
        return `
        <li class="locations__item" data-location="${displayName}", data-lat="${geoname.lat}" data-lng="${geoname.lng}" data-geoname-id="${geoname.geonameId}">${displayName}</li>`;
    }).join('');
};

export { suggestionsHTML };