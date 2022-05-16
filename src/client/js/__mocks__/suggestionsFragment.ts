export const suggestionsFragment = jest.fn(() => {
    const li = document.createElement('li');
    li.textContent = 'List Item';
    return li;
});