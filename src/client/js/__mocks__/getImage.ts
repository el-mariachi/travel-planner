export const getImage = jest.fn((name, countryName, submitNo) => {
    return Promise.resolve({
        submitNo,
        url: 'image_url',
        image: {
            assets: {
                preview_1000: {
                    url: 'image'
                }
            }
        }
    })
});