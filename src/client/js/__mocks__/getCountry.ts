export const getCountry = jest.fn(code => {
    return Promise.resolve({
        name: 'China',
        currencies: ['Yuan'],
        languages: ['Chinese'],
        capital: 'Beijing',
        flag: 'flag_url'
    })
});