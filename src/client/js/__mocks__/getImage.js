export const getImage = jest.fn((name, countryName, submitNo) => {
    return Promise.resolve({
        submitNo,
        url: 'image_url'
    })
});